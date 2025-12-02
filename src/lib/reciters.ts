export interface Reciter {
    identifier: string
    language: string
    name: string
    englishName: string
    format: string
    type: string
}

export async function getAvailableReciters(): Promise<Reciter[]> {
    try {
        const response = await fetch('https://api.alquran.cloud/v1/edition?format=audio&language=ar&type=versebyverse', {
            next: { revalidate: 86400 * 30 } // Cache for 30 days
        })

        if (!response.ok) {
            throw new Error('Failed to fetch reciters')
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error fetching reciters:', error)
        // Fallback to a few default reciters if API fails
        return [
            { identifier: 'ar.alafasy', language: 'ar', name: 'Mishary Rashid Alafasy', englishName: 'Mishary Rashid Alafasy', format: 'audio', type: 'versebyverse' },
            { identifier: 'ar.abdulbasit', language: 'ar', name: 'Abdul Basit', englishName: 'Abdul Basit', format: 'audio', type: 'versebyverse' },
            { identifier: 'ar.sudais', language: 'ar', name: 'Abdurrahmaan As-Sudais', englishName: 'Abdurrahmaan As-Sudais', format: 'audio', type: 'versebyverse' },
        ]
    }
}

