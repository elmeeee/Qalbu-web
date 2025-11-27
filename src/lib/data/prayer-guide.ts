export interface PrayerStep {
    id: number
    title: {
        en: string
        id: string
        ms: string
        ar: string
    }
    description: {
        en: string
        id: string
        ms: string
    }
    arabic?: string
    transliteration?: string
    translation?: {
        en: string
        id: string
        ms: string
    }
}

export const prayerSteps: PrayerStep[] = [
    {
        id: 1,
        title: {
            en: "Niyyah (Intention)",
            id: "Niat",
            ms: "Niat",
            ar: "النية"
        },
        description: {
            en: "Stand facing the Qiblah and make the intention in your heart for the specific prayer you are about to perform.",
            id: "Berdiri menghadap Kiblat dan berniat di dalam hati untuk sholat tertentu yang akan Anda lakukan.",
            ms: "Berdiri menghadap Kiblat dan berniat di dalam hati untuk solat tertentu yang akan Anda lakukan."
        }
    },
    {
        id: 2,
        title: {
            en: "Takbiratul Ihram",
            id: "Takbiratul Ihram",
            ms: "Takbiratul Ihram",
            ar: "تكبيرة الإحرام"
        },
        description: {
            en: "Raise your hands to your ears (or shoulders) and say 'Allahu Akbar'.",
            id: "Angkat kedua tangan sejajar telinga (atau bahu) dan ucapkan 'Allahu Akbar'.",
            ms: "Angkat kedua tangan sejajar telinga (atau bahu) dan ucapkan 'Allahu Akbar'."
        },
        arabic: "الله أكبر",
        transliteration: "Allahu Akbar",
        translation: {
            en: "Allah is the Greatest",
            id: "Allah Maha Besar",
            ms: "Allah Maha Besar"
        }
    },
    {
        id: 3,
        title: {
            en: "Qiyam (Standing)",
            id: "Berdiri (Qiyam)",
            ms: "Berdiri (Qiyam)",
            ar: "القيام"
        },
        description: {
            en: "Place your right hand over your left hand on your chest/navel. Recite Surah Al-Fatiha and another Surah.",
            id: "Letakkan tangan kanan di atas tangan kiri di dada/pusar. Baca Surah Al-Fatihah dan Surah lainnya.",
            ms: "Letakkan tangan kanan di atas tangan kiri di dada/pusar. Baca Surah Al-Fatihah dan Surah lainnya."
        }
    },
    {
        id: 4,
        title: {
            en: "Ruku (Bowing)",
            id: "Rukuk",
            ms: "Rukuk",
            ar: "الركوع"
        },
        description: {
            en: "Bow down, placing hands on knees, keeping back straight. Say 'Subhana Rabbiyal Azim' 3 times.",
            id: "Rukuk dengan meletakkan tangan di lutut, punggung rata. Ucapkan 'Subhana Rabbiyal Azim' 3 kali.",
            ms: "Rukuk dengan meletakkan tangan di lutut, punggung rata. Ucapkan 'Subhana Rabbiyal Azim' 3 kali."
        },
        arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
        transliteration: "Subhana Rabbiyal Azim",
        translation: {
            en: "Glory be to my Lord the Almighty",
            id: "Maha Suci Tuhanku Yang Maha Agung",
            ms: "Maha Suci Tuhanku Yang Maha Agung"
        }
    },
    {
        id: 5,
        title: {
            en: "I'tidal (Standing up from Ruku)",
            id: "Iktidal",
            ms: "Iktidal",
            ar: "الاعتدال"
        },
        description: {
            en: "Stand up straight from Ruku and say 'Sami Allahu liman hamidah'.",
            id: "Bangun dari rukuk dan berdiri tegak sambil mengucapkan 'Sami Allahu liman hamidah'.",
            ms: "Bangun dari rukuk dan berdiri tegak sambil mengucapkan 'Sami Allahu liman hamidah'."
        },
        arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ",
        transliteration: "Sami' Allahu liman hamidah",
        translation: {
            en: "Allah hears those who praise Him",
            id: "Allah mendengar orang yang memuji-Nya",
            ms: "Allah mendengar orang yang memuji-Nya"
        }
    },
    {
        id: 6,
        title: {
            en: "Sujud (Prostration)",
            id: "Sujud",
            ms: "Sujud",
            ar: "السجود"
        },
        description: {
            en: "Prostrate on the floor with forehead, nose, palms, knees, and toes touching the ground. Say 'Subhana Rabbiyal A'la' 3 times.",
            id: "Sujud di lantai dengan dahi, hidung, telapak tangan, lutut, dan jari kaki menyentuh tanah. Ucapkan 'Subhana Rabbiyal A'la' 3 kali.",
            ms: "Sujud di lantai dengan dahi, hidung, telapak tangan, lutut, dan jari kaki menyentuh tanah. Ucapkan 'Subhana Rabbiyal A'la' 3 kali."
        },
        arabic: "سُبْحَانَ رَبِّيَ الأَعْلَى",
        transliteration: "Subhana Rabbiyal A'la",
        translation: {
            en: "Glory be to my Lord the Most High",
            id: "Maha Suci Tuhanku Yang Maha Tinggi",
            ms: "Maha Suci Tuhanku Yang Maha Tinggi"
        }
    },
    {
        id: 7,
        title: {
            en: "Sitting between two Sujood",
            id: "Duduk di antara dua Sujud",
            ms: "Duduk di antara dua Sujud",
            ar: "الجلوس بين السجدتين"
        },
        description: {
            en: "Sit up from Sujud and say the supplication 'Rabbighfirli...'.",
            id: "Duduk dari sujud dan baca doa 'Rabbighfirli...'.",
            ms: "Duduk dari sujud dan baca doa 'Rabbighfirli...'. "
        },
        arabic: "رَبِّ اغْفِرْ لِي",
        transliteration: "Rabbighfir li",
        translation: {
            en: "O Lord, forgive me",
            id: "Ya Tuhanku, ampunilah aku",
            ms: "Ya Tuhanku, ampunilah aku"
        }
    },
    {
        id: 8,
        title: {
            en: "Tashahhud",
            id: "Tasyahud",
            ms: "Tasyahud",
            ar: "التحيات"
        },
        description: {
            en: "Sit for the final testimony. Recite the Tashahhud and Salawat.",
            id: "Duduk untuk tasyahud akhir. Baca Tasyahud dan Shalawat.",
            ms: "Duduk untuk tasyahud akhir. Baca Tasyahud dan Shalawat."
        }
    },
    {
        id: 9,
        title: {
            en: "Taslim (Salam)",
            id: "Salam",
            ms: "Salam",
            ar: "التسليم"
        },
        description: {
            en: "Turn your head to the right and say 'Assalamu alaykum wa rahmatullah', then to the left.",
            id: "Menoleh ke kanan dan ucapkan 'Assalamu alaykum wa rahmatullah', lalu ke kiri.",
            ms: "Menoleh ke kanan dan ucapkan 'Assalamu alaykum wa rahmatullah', lalu ke kiri."
        },
        arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
        transliteration: "Assalamu alaykum wa rahmatullah",
        translation: {
            en: "Peace be upon you and the mercy of Allah",
            id: "Semoga kedamaian dan rahmat Allah menyertai kalian",
            ms: "Semoga kedamaian dan rahmat Allah menyertai kalian"
        }
    }
]
