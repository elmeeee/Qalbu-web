
import { NextResponse } from 'next/server';

interface Mosque {
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

// List of public Overpass API instances to try
const OVERPASS_INSTANCES = [
    'https://overpass-api.de/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter',
    'https://z.overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter'
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get('lat');
    const lonParam = searchParams.get('lon');
    const radiusParam = searchParams.get('radius');

    if (!latParam || !lonParam) {
        return NextResponse.json({ error: 'Missing latitude or longitude' }, { status: 400 });
    }

    const lat = parseFloat(latParam);
    const lon = parseFloat(lonParam);
    const radius = radiusParam ? parseFloat(radiusParam) : 3000;

    if (isNaN(lat) || isNaN(lon)) {
        return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }

    const query = `
        [out:json][timeout:15];
        (
          node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
          way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
        );
        out body;
        >;
        out skel qt;
    `;

    let lastError: any;

    for (const baseUrl of OVERPASS_INSTANCES) {
        try {
            console.log(`Trying Overpass instance: ${baseUrl}`);
            const response = await fetch(`${baseUrl}?data=${encodeURIComponent(query)}`, {
                headers: {
                    'User-Agent': 'Qalbu-Web/1.0 (https://qalbu.com; contact@qalbu.com)'
                },
                // Next.js server fetch caching
                next: { revalidate: 3600 } // Cache for 1 hour
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.warn(`Overpass instance ${baseUrl} failed:`, response.status, errorText);
                throw new Error(`${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Filter only nodes/ways that have tags
            const mosques = data.elements.filter((el: any) => el.tags && (el.tags.name || el.tags.amenity === 'place_of_worship'));

            // Calculate distance and sort
            const mosquesWithDistance = mosques.map((mosque: any) => {
                const mLat = mosque.lat || (mosque.center ? mosque.center.lat : lat); // Simplify for ways
                const mLon = mosque.lon || (mosque.center ? mosque.center.lon : lon);
                return {
                    ...mosque,
                    distance: calculateDistance(lat, lon, mLat, mLon)
                };
            }).sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));

            // Filter out mosques that are too far (> 3km) or too close (0km/error)
            const filteredMosques = mosquesWithDistance.filter((m: any) => (m.distance || 0) > 0 && (m.distance || 0) <= 3);

            return NextResponse.json(filteredMosques);

        } catch (error) {
            console.warn(`Failed to fetch from ${baseUrl}:`, error);
            lastError = error;
            // Continue to next instance
        }
    }

    return NextResponse.json({ error: 'Failed to fetch mosques from all available servers' }, { status: 502 });
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
