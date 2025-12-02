import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://api.alquran.cloud/v1'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const surah = parseInt(searchParams.get('surah') || '1')
    const startAyah = parseInt(searchParams.get('startAyah') || '1')
    const count = parseInt(searchParams.get('count') || '5')
    const edition = searchParams.get('edition') || 'en.asad'
    const audioEdition = searchParams.get('audioEdition') || 'ar.alafasy'

    try {
        // Fetch the full surah to get total ayahs
        const surahInfoResponse = await fetch(`${BASE_URL}/surah/${surah}`, { cache: 'force-cache' })
        const surahInfo = await surahInfoResponse.json()
        const totalAyahs = surahInfo.data.numberOfAyahs

        const ayahs = []
        let currentSurah = surah
        let currentAyah = startAyah

        for (let i = 0; i < count; i++) {
            try {
                // If we've exceeded the current surah's ayahs, move to next surah
                if (currentAyah > totalAyahs) {
                    currentSurah = currentSurah === 114 ? 1 : currentSurah + 1
                    currentAyah = 1
                }

                const [arabicResponse, audioResponse, translationResponse, transliterationResponse] = await Promise.all([
                    fetch(`${BASE_URL}/ayah/${currentSurah}:${currentAyah}/quran-uthmani`, { cache: 'force-cache' }),
                    fetch(`${BASE_URL}/ayah/${currentSurah}:${currentAyah}/${audioEdition}`, { cache: 'force-cache' }),
                    fetch(`${BASE_URL}/ayah/${currentSurah}:${currentAyah}/${edition}`, { cache: 'force-cache' }),
                    fetch(`${BASE_URL}/ayah/${currentSurah}:${currentAyah}/en.transliteration`, { cache: 'force-cache' }),
                ])

                if (arabicResponse.ok) {
                    const [arabicData, audioData, translationData, transliterationData] = await Promise.all([
                        arabicResponse.json(),
                        audioResponse.json(),
                        translationResponse.json(),
                        transliterationResponse.json(),
                    ])

                    ayahs.push({
                        ...arabicData.data,
                        audio: audioData.data.audio,
                        translation: translationData.data.text,
                        transliteration: transliterationData.data.text,
                        surah: arabicData.data.surah
                    })
                }

                currentAyah++
            } catch (error) {
                console.error(`Error fetching ayah ${currentSurah}:${currentAyah}:`, error)
            }
        }

        return NextResponse.json({
            ayahs,
            nextSurah: currentSurah,
            nextAyah: currentAyah
        })
    } catch (error) {
        console.error('Error in ayahs API:', error)
        return NextResponse.json({ error: 'Failed to fetch ayahs' }, { status: 500 })
    }
}
