export interface HadithItem {
    number: number
    arab: string
    id: string
}

export interface HadithResponse {
    name: string
    slug: string
    total: number
    items: HadithItem[]
}

export async function getHadiths(book: string = 'bukhari', range: string = '1-50'): Promise<HadithResponse> {
    try {
        const response = await fetch(`https://api.hadith.gading.dev/books/${book}?range=${range}`, {
            next: { revalidate: 86400 }, // Cache for 24 hours
        })

        if (!response.ok) {
            throw new Error('Failed to fetch hadiths')
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error fetching hadiths:', error)
        return { name: '', slug: '', total: 0, items: [] }
    }
}

export interface ProphetStory {
    name: string
    thn_kelahiran: string
    usia: string
    description: string
    tmp_dakwah: string
}

export async function getProphetStories(): Promise<ProphetStory[]> {
    try {
        const response = await fetch('https://islamic-api-zhirrr.vercel.app/api/kisahnabi', {
            next: { revalidate: 86400 }, // Cache for 24 hours
        })

        if (!response.ok) {
            throw new Error('Failed to fetch prophet stories')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching prophet stories:', error)
        return []
    }
}

export interface PrayerGuideItem {
    id: number
    name: string
    arabic: string
    latin: string
    terjemah: string
}

export async function getPrayerGuide(): Promise<PrayerGuideItem[]> {
    try {
        const response = await fetch('https://islamic-api-zhirrr.vercel.app/api/bacaanshalat', {
            next: { revalidate: 86400 }, // Cache for 24 hours
        })

        if (!response.ok) {
            throw new Error('Failed to fetch prayer guide')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching prayer guide:', error)
        return []
    }
}
