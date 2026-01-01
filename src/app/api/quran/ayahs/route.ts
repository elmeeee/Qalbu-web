import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://api.alquran.cloud/v1'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const surah = parseInt(searchParams.get('surah') || '1')
    const startAyah = parseInt(searchParams.get('startAyah') || '1')
    const count = parseInt(searchParams.get('count') || '5')
    const edition = searchParams.get('edition') || 'en.asad'
    const audioEdition = searchParams.get('audioEdition') || 'ar.alafasy'
    const quranEdition = searchParams.get('quranEdition') || 'quran-tajweed'

    try {
        // 1. Get Surah Info to know total verses
        let currentSurahNum = surah;
        let currentStartAyah = startAyah;

        // Handle case where startAyah might be invalid or crossover (simple correction)
        if (currentSurahNum < 1) currentSurahNum = 1;
        if (currentSurahNum > 114) currentSurahNum = 114;

        const surahInfoResponse = await fetch(`${BASE_URL}/surah/${currentSurahNum}`, { cache: 'force-cache' });
        if (!surahInfoResponse.ok) throw new Error('Failed to fetch surah info');
        const surahInfo = await surahInfoResponse.json();
        const totalAyahs = surahInfo.data.numberOfAyahs;

        // If startAyah is beyond this surah, move to next
        if (currentStartAyah > totalAyahs) {
            if (currentSurahNum < 114) {
                currentSurahNum++;
                currentStartAyah = 1;
                // Re-fetch info for new surah
                const newInfoResponse = await fetch(`${BASE_URL}/surah/${currentSurahNum}`, { cache: 'force-cache' });
                const newInfo = await newInfoResponse.json();
                // Update references
                surahInfo.data = newInfo.data; // Use new surah data for metadata
            } else {
                return NextResponse.json({ ayahs: [], nextSurah: 114, nextAyah: totalAyahs + 1 });
            }
        }

        // 2. Calculate limit (don't go past end of Surah in one request)
        // API uses offset 0 for Ayah 1.
        // We want 'count' items, but capped at remaining items in surah.
        const remainingInSurah = surahInfo.data.numberOfAyahs - currentStartAyah + 1;
        const limit = Math.min(count, remainingInSurah);
        const offset = currentStartAyah - 1;

        if (limit <= 0) {
            return NextResponse.json({ ayahs: [], nextSurah: currentSurahNum + 1, nextAyah: 1 });
        }

        // 3. Parallel Fetch for editions
        // We fetch the Surah with offset and limit
        const endpoints = [
            `${BASE_URL}/surah/${currentSurahNum}/quran-uthmani?offset=${offset}&limit=${limit}`,
            `${BASE_URL}/surah/${currentSurahNum}/${audioEdition}?offset=${offset}&limit=${limit}`,
            `${BASE_URL}/surah/${currentSurahNum}/${edition}?offset=${offset}&limit=${limit}`,
            `${BASE_URL}/surah/${currentSurahNum}/en.transliteration?offset=${offset}&limit=${limit}`,
            `${BASE_URL}/surah/${currentSurahNum}/${quranEdition}?offset=${offset}&limit=${limit}`
        ];

        const responses = await Promise.all(endpoints.map(url => fetch(url, { cache: 'force-cache' })));

        // Check for failures
        for (const r of responses) {
            if (!r.ok) {
                const text = await r.text();
                console.error(`API Error for ${r.url}:`, r.status, text);
            }
        }

        const data = await Promise.all(responses.map(r => r.ok ? r.json() : null));

        const [arabicData, audioData, translationData, transliterationData, tajweedData] = data;

        if (!arabicData || !arabicData.data || !arabicData.data.ayahs) {
            throw new Error('Failed to fetch Arabic text');
        }

        // 4. Merge Data
        const ayahs = arabicData.data.ayahs.map((baseAyah: any, index: number) => {
            return {
                ...baseAyah, // number, text, numberInSurah, juz, manzil, etc.
                audio: audioData?.data?.ayahs[index]?.audio || '',
                translation: translationData?.data?.ayahs[index]?.text || '',
                transliteration: transliterationData?.data?.ayahs[index]?.text || '',
                tajweed: tajweedData?.data?.ayahs[index]?.text || baseAyah.text,
                surah: surahInfo.data // attach surah info to each ayah
            };
        });

        // 5. Determine Next Pointers
        let nextSurah = currentSurahNum;
        let nextAyah = currentStartAyah + limit;

        // If we reached the end of the surah, setup next request to start at next surah
        if (nextAyah > surahInfo.data.numberOfAyahs) {
            if (currentSurahNum < 114) {
                nextSurah++;
                nextAyah = 1;
            } else {
                // End of Quran
                nextAyah = surahInfo.data.numberOfAyahs + 1;
            }
        }

        return NextResponse.json({
            ayahs,
            nextSurah,
            nextAyah
        });

    } catch (error) {
        console.error('Error in ayahs API:', error)
        return NextResponse.json({ error: 'Failed to fetch ayahs' }, { status: 500 })
    }
}
