export interface Surah {
    number: number
    name: string
    englishName: string
    englishNameTranslation: string
    numberOfAyahs: number
    revelationType: 'Meccan' | 'Medinan'
}

export interface Ayah {
    number: number
    text: string
    translation?: string
    transliteration?: string
    numberInSurah: number
    juz: number
    page: number
    audio: string
    audioSecondary?: string[]
}

export interface SurahDetail {
    number: number
    name: string
    englishName: string
    englishNameTranslation: string
    revelationType: string
    numberOfAyahs: number
    ayahs: Ayah[]
}

export interface Edition {
    identifier: string
    language: string
    name: string
    englishName: string
    format: string
    type: string
}

const BASE_URL = 'https://api.alquran.cloud/v1'

export async function getAllSurahs(): Promise<Surah[]> {
    const response = await fetch(`${BASE_URL}/surah`, {
        next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
        throw new Error('Failed to fetch surahs')
    }

    const data = await response.json()
    return data.data
}

export async function getSurahById(
    id: number,
    edition: string = 'en.asad'
): Promise<SurahDetail> {
    const response = await fetch(`${BASE_URL}/surah/${id}/${edition}`, {
        next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
        throw new Error('Failed to fetch surah')
    }

    const data = await response.json()
    return data.data
}

import { Language, quranEditions } from '@/lib/i18n'

export async function getSurahWithAudio(id: number, language: Language = 'en'): Promise<SurahDetail> {
    const edition = quranEditions[language]

    const [arabicResponse, audioResponse, translationResponse, transliterationResponse] = await Promise.all([
        fetch(`${BASE_URL}/surah/${id}/quran-tajweed`),
        fetch(`${BASE_URL}/surah/${id}/ar.alafasy`),
        fetch(`${BASE_URL}/surah/${id}/${edition}`),
        fetch(`${BASE_URL}/surah/${id}/en.transliteration`), // Transliteration usually stays English/Latin
    ])

    if (!arabicResponse.ok || !audioResponse.ok || !translationResponse.ok || !transliterationResponse.ok) {
        throw new Error('Failed to fetch surah data')
    }

    const [arabicData, audioData, translationData, transliterationData] = await Promise.all([
        arabicResponse.json(),
        audioResponse.json(),
        translationResponse.json(),
        transliterationResponse.json(),
    ])

    const surah = arabicData.data
    const audioAyahs = audioData.data.ayahs
    const translationAyahs = translationData.data.ayahs
    const transliterationAyahs = transliterationData.data.ayahs

    // Merge all data with ayahs
    surah.ayahs = surah.ayahs.map((ayah: Ayah, index: number) => ({
        ...ayah,
        audio: audioAyahs[index]?.audio || '',
        translation: translationAyahs[index]?.text || '',
        transliteration: transliterationAyahs[index]?.text || '',
    }))

    return surah
}

export async function getJuz(juzNumber: number): Promise<any> {
    const response = await fetch(`${BASE_URL}/juz/${juzNumber}/quran-uthmani`, {
        next: { revalidate: 86400 },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch juz')
    }

    const data = await response.json()
    return data.data
}

export async function searchQuran(query: string): Promise<any[]> {
    const response = await fetch(`${BASE_URL}/search/${encodeURIComponent(query)}/all/en`, {
        next: { revalidate: 3600 },
    })

    if (!response.ok) {
        throw new Error('Failed to search Quran')
    }

    const data = await response.json()
    return data.data.matches || []
}

export async function getAyahAudio(surahNumber: number, ayahNumber: number): Promise<string> {
    // Using Mishary Rashid Alafasy recitation
    const paddedSurah = String(surahNumber).padStart(3, '0')
    const paddedAyah = String(ayahNumber).padStart(3, '0')
    return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${paddedSurah}${paddedAyah}.mp3`
}

export function getReciterAudio(
    surahNumber: number,
    ayahNumber: number,
    reciter: string = 'ar.alafasy'
): string {
    const paddedSurah = String(surahNumber).padStart(3, '0')
    const paddedAyah = String(ayahNumber).padStart(3, '0')
    return `https://cdn.islamic.network/quran/audio/128/${reciter}/${paddedSurah}${paddedAyah}.mp3`
}
