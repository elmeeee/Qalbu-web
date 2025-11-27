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
        const query = `
            [out:json][timeout:25];
            (
              node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
              way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
            );
            out body;
            >;
            out skel qt;
        `;

        const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error('Failed to fetch mosques');
        }

        const data = await response.json();

        // Filter only nodes/ways that have tags (some might be geometry nodes)
        // For simplicity, we'll focus on elements that have the 'name' tag or are clearly mosques
        const mosques = data.elements.filter((el: any) => el.tags && (el.tags.name || el.tags.amenity === 'place_of_worship'));

        // Calculate distance and sort
        const mosquesWithDistance = mosques.map((mosque: any) => {
            const mLat = mosque.lat || (mosque.center ? mosque.center.lat : lat); // Simplify for ways
            const mLon = mosque.lon || (mosque.center ? mosque.center.lon : lon);
            return {
                ...mosque,
                distance: calculateDistance(lat, lon, mLat, mLon)
            };
        }).sort((a: Mosque, b: Mosque) => (a.distance || 0) - (b.distance || 0));

        // Filter out mosques that are too far (> 3km) or too close (0km/error)
        return mosquesWithDistance.filter((m: Mosque) => (m.distance || 0) > 0 && (m.distance || 0) <= 3);
    } catch (error) {
        console.error('Error fetching mosques:', error);
        return [];
    }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return parseFloat(d.toFixed(2));
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}
