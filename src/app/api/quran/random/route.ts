import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://api.alquran.cloud/v1'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const count = parseInt(searchParams.get('count') || '5')
    const edition = searchParams.get('edition') || 'en.asad'
    const quranEdition = searchParams.get('quranEdition') || 'quran-tajweed'

    try {
        const totalAyahs = 6236
        const randomIndices = Array.from({ length: count }, () => Math.floor(Math.random() * totalAyahs) + 1)

        const promises = randomIndices.map(async (index) => {
            try {
                const [arabicResponse, audioResponse, translationResponse, transliterationResponse] = await Promise.all([
                    fetch(`${BASE_URL}/ayah/${index}/${quranEdition}`, { cache: 'no-store' }),
                    fetch(`${BASE_URL}/ayah/${index}/ar.alafasy`, { cache: 'no-store' }),
                    fetch(`${BASE_URL}/ayah/${index}/${edition}`, { cache: 'no-store' }),
                    fetch(`${BASE_URL}/ayah/${index}/en.transliteration`, { cache: 'no-store' }),
                ])

                if (!arabicResponse.ok) return null

                const [arabicData, audioData, translationData, transliterationData] = await Promise.all([
                    arabicResponse.json(),
                    audioResponse.json(),
                    translationResponse.json(),
                    transliterationResponse.json(),
                ])

                const ayah = arabicData.data
                return {
                    ...ayah,
                    audio: audioData.data.audio,
                    translation: translationData.data.text,
                    transliteration: transliterationData.data.text,
                    surah: arabicData.data.surah
                }
            } catch (error) {
                console.error(`Error fetching ayah ${index}:`, error)
                return null
            }
        })

        const results = await Promise.all(promises)
        const validResults = results.filter((ayah) => ayah !== null)

        return NextResponse.json(validResults)
    } catch (error) {
        console.error('Error in random ayahs API:', error)
        return NextResponse.json({ error: 'Failed to fetch random ayahs' }, { status: 500 })
    }
}
