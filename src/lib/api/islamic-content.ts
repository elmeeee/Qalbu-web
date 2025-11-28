import { prayerGuideData } from '../data/prayer-guide';
import { Language } from '../i18n';

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
    description: string
    image?: string
    // Optional fields that might not be available in Wikipedia API
    thn_kelahiran?: string
    usia?: string
    tmp_dakwah?: string
}

const prophetNames = [
    'Adam', 'Idris', 'Nuh', 'Hud', 'Saleh', 'Ibrahim', 'Lut', 'Ismail', 'Ishaq', 'Yaqub',
    'Yusuf', 'Ayyub', 'Shu\'aib', 'Musa', 'Harun', 'Dhul-Kifl', 'Dawud', 'Sulaiman', 'Ilyas',
    'Alyasa', 'Yunus', 'Zakariya', 'Yahya', 'Isa', 'Muhammad'
];

// Mapping for Wikipedia slugs if they differ significantly or for specific languages
const prophetSlugs: { [key: string]: { [key in Language]?: string } } = {
    'Adam': { en: 'Adam_in_Islam', id: 'Adam_dalam_Islam', ms: 'Nabi_Adam_a.s.', vi: 'Adam_trong_Hồi_giáo', th: 'อาดัม_ในศาสนาอิสลาม' },
    'Muhammad': { en: 'Muhammad', id: 'Muhammad', ms: 'Nabi_Muhammad_SAW', vi: 'Muhammad', th: 'มุฮัมมัด' },
    // Add more mappings as needed, otherwise fallback to English or simple translation
};

export async function getProphetStories(language: Language = 'en'): Promise<ProphetStory[]> {
    try {
        // Use English as fallback for API calls if specific language support is tricky
        // But we try to support all.
        // Wikipedia API: https://{lang}.wikipedia.org/api/rest_v1/page/summary/{title}

        const promises = prophetNames.map(async (name) => {
            let slug = prophetSlugs[name]?.[language];
            if (!slug) {
                // Simple heuristic: "Prophet Name" or just "Name"
                // For 'en', it's usually "Name_in_Islam" or just "Name"
                if (language === 'en') slug = `${name}_in_Islam`;
                else if (language === 'id' || language === 'ms') slug = `Nabi_${name}`;
                else if (language === 'vi') slug = `${name}_trong_Hồi_giáo`; // Heuristic for Vietnamese
                else slug = name; // Fallback
            }

            // Fallback to English if no slug found or if we want to ensure data
            // But user wants "support all language".
            // Let's try the language specific URL first.
            let langCode = language;
            // No special mapping needed for current supported languages (zh, ko, ja, th, vi, id, ms, en, nl)
            // Wikipedia codes usually match ISO codes
            if (language === 'zh') langCode = 'zh'; // Wikipedia uses zh

            let url = `https://${langCode}.wikipedia.org/api/rest_v1/page/summary/${slug}`;

            // Try fetching
            let response = await fetch(url);

            // If 404, try simpler slug (just the name)
            if (!response.ok) {
                url = `https://${langCode}.wikipedia.org/api/rest_v1/page/summary/${name}`;
                response = await fetch(url);
            }

            // If still 404, fallback to English
            if (!response.ok && langCode !== 'en') {
                url = `https://en.wikipedia.org/api/rest_v1/page/summary/${name}_in_Islam`;
                response = await fetch(url);
            }

            if (!response.ok) return null;

            const data = await response.json();
            return {
                name: name, // Keep the display name consistent
                description: data.extract,
                image: data.thumbnail?.source,
                // Mocking these fields as they are not in summary API, to prevent UI errors if it expects them
                thn_kelahiran: '-',
                usia: '-',
                tmp_dakwah: '-'
            } as ProphetStory;
        });

        const results = await Promise.all(promises);
        return results.filter((item): item is ProphetStory => item !== null);

    } catch (error) {
        console.error('Error fetching prophet stories:', error);
        return [];
    }
}

export interface PrayerGuideItem {
    id: number
    name: string
    arabic: string
    latin: string
    terjemah: string
}

// Note: There is no global open API for step-by-step Prayer Guide in all languages.
// We use a high-quality internal dataset to ensure accuracy and multilingual support.
export async function getPrayerGuide(language: Language = 'en'): Promise<PrayerGuideItem[]> {
    return prayerGuideData.map(item => {
        const translation = item.translations[language] || item.translations['en'];
        return {
            id: item.id,
            name: translation?.name || '',
            arabic: item.arabic,
            latin: item.latin,
            terjemah: translation?.terjemah || ''
        };
    });
}
