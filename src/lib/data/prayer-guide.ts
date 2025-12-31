import { Language } from '../i18n';

export interface PrayerGuideContent {
    name: string;
    terjemah: string;
}

export interface PrayerGuideItem {
    id: number;
    arabic: string;
    latin: string;
    translations: { [key in Language]?: PrayerGuideContent };
}

export const prayerGuideData: PrayerGuideItem[] = [
    {
        id: 1,
        arabic: "اللَّهُ أَكْبَرُ",
        latin: "Allahu Akbar",
        translations: {
            en: { name: "Takbiratul Ihram", terjemah: "Allah is the Greatest" },
            ms: { name: "Takbiratul Ihram", terjemah: "Allah Maha Besar" },
            id: { name: "Takbiratul Ihram", terjemah: "Allah Maha Besar" },

        }
    },
    {
        id: 2,
        arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
        latin: "Subhana Rabbiyal Adzim",
        translations: {
            en: { name: "Ruku'", terjemah: "Glory be to my Lord the Almighty" },
            ms: { name: "Rukuk", terjemah: "Maha Suci Tuhanku Yang Maha Agung" },
            id: { name: "Rukuk", terjemah: "Maha Suci Tuhanku Yang Maha Agung" },

        }
    },
    {
        id: 3,
        arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ",
        latin: "Sami'allahu liman hamidah",
        translations: {
            en: { name: "I'tidal", terjemah: "Allah hears those who praise Him" },
            ms: { name: "I'tidal", terjemah: "Allah mendengar sesiapa yang memuji-Nya" },
            id: { name: "I'tidal", terjemah: "Allah mendengar orang yang memuji-Nya" },

        }
    },
    {
        id: 4,
        arabic: "سُبْحَانَ رَبِّيَ الأَعْلَى",
        latin: "Subhana Rabbiyal A'la",
        translations: {
            en: { name: "Sujud", terjemah: "Glory be to my Lord the Most High" },
            ms: { name: "Sujud", terjemah: "Maha Suci Tuhanku Yang Maha Tinggi" },
            id: { name: "Sujud", terjemah: "Maha Suci Tuhanku Yang Maha Tinggi" },

        }
    },
    {
        id: 5,
        arabic: "رَبِّ اغْفِرْ لِي وَارْحَمْنِي",
        latin: "Rabbighfirli warhamni",
        translations: {
            en: { name: "Sitting Between Two Sujood", terjemah: "My Lord, forgive me and have mercy on me" },
            ms: { name: "Duduk Antara Dua Sujud", terjemah: "Ya Tuhanku, ampunilah aku dan rahmatilah aku" },
            id: { name: "Duduk Diantara Dua Sujud", terjemah: "Ya Tuhanku, ampunilah aku dan rahmatilah aku" },

        }
    },
    {
        id: 6,
        arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ",
        latin: "At-tahiyyatu lillahi was-salawatu wat-tayyibat",
        translations: {
            en: { name: "Tashahhud", terjemah: "All compliments, prayers and pure words are due to Allah" },
            ms: { name: "Tasyahhud", terjemah: "Segala penghormatan, keberkatan, dan kebaikan adalah milik Allah" },
            id: { name: "Tasyahhud", terjemah: "Segala kehormatan, sholat dan kebaikan adalah milik Allah" },

        }
    },
    {
        id: 7,
        arabic: "السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ",
        latin: "Assalamu 'alaikum wa rahmatullah",
        translations: {
            en: { name: "Salam", terjemah: "Peace be upon you and the mercy of Allah" },
            ms: { name: "Salam", terjemah: "Sejahtera ke atas kamu dan rahmat Allah" },
            id: { name: "Salam", terjemah: "Semoga keselamatan dan rahmat Allah tercurah kepadamu" },

        }
    }
];
