export interface DoaItem {
    id: number
    judul: string
    latin: string
    arab: string
    terjemah: string
}

export async function getDoas(): Promise<DoaItem[]> {
    try {
        const response = await fetch('https://open-api.my.id/api/doa', {
            next: { revalidate: 86400 }, // Cache for 24 hours
        })

        if (!response.ok) {
            throw new Error('Failed to fetch doas')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching doas:', error)
        return []
    }
}
