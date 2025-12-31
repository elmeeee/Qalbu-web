export interface Mosque {
    id: number
    lat: number
    lon: number
    tags: {
        name?: string
        "addr:street"?: string
        "addr:city"?: string
    }
    distance?: number // in km
}

export async function getNearbyMosques(lat: number, lon: number, radius: number = 3000): Promise<Mosque[]> {
    try {
        const response = await fetch(`/api/mosques?lat=${lat}&lon=${lon}&radius=${radius}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to fetch mosques: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching mosques:', error);
        throw error;
    }
}
