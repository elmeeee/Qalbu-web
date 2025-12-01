import { Language } from '../i18n';

export interface DoaItem {
    id: number
    grup: string
    nama: string
    ar: string
    tr: string
    idn: string
    tentang: string
    tag: string[]
}

export interface DoaResponse {
    status: string
    total: number
    data: DoaItem[]
}

/**
 * Fetch daily duas from equran.id API
 * @param grup Optional filter by category/group
 * @param tag Optional filter by tag (e.g., "tidur", "malam", "pagi")
 * @returns Array of dua items
 */
export async function getDoas(grup?: string, tag?: string): Promise<DoaItem[]> {
    try {
        let url = 'https://equran.id/api/doa';
        const params = new URLSearchParams();

        if (grup) params.append('grup', grup);
        if (tag) params.append('tag', tag);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            next: { revalidate: 86400 }, // Cache for 24 hours
        });

        if (!response.ok) {
            throw new Error('Failed to fetch duas');
        }

        const data: DoaResponse = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching duas from equran.id:', error);
        return [];
    }
}

/**
 * Fetch a specific dua by ID
 * @param id The dua ID
 * @returns Single dua item or null
 */
export async function getDoaById(id: number): Promise<DoaItem | null> {
    try {
        const response = await fetch(`https://equran.id/api/doa/${id}`, {
            next: { revalidate: 86400 },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch dua');
        }

        const data = await response.json();
        return data.data || null;
    } catch (error) {
        console.error('Error fetching dua by ID:', error);
        return null;
    }
}

/**
 * Get random daily duas for widget display
 * @param count Number of duas to fetch
 * @returns Array of random dua items
 */
export async function getRandomDailyDuas(count: number = 10): Promise<DoaItem[]> {
    try {
        const allDuas = await getDoas();

        if (allDuas.length === 0) return [];

        // Shuffle and get random duas
        const shuffled = [...allDuas].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    } catch (error) {
        console.error('Error fetching random duas:', error);
        return [];
    }
}
