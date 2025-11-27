export interface Doa {
    id: number
    title: {
        en: string
        id: string
        ms: string
        ar: string
    }
    arabic: string
    transliteration: string
    translation: {
        en: string
        id: string
        ms: string
    }
    source: string
}

export const doas: Doa[] = [
    {
        id: 1,
        title: {
            en: "Before Sleeping",
            id: "Sebelum Tidur",
            ms: "Sebelum Tidur",
            ar: "قبل النوم"
        },
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amutu wa ahya",
        translation: {
            en: "In Your Name, O Allah, I die and I live.",
            id: "Dengan nama-Mu, Ya Allah, aku mati dan aku hidup.",
            ms: "Dengan nama-Mu, Ya Allah, aku mati dan aku hidup."
        },
        source: "Bukhari & Muslim"
    },
    {
        id: 2,
        title: {
            en: "Waking Up",
            id: "Bangun Tidur",
            ms: "Bangun Tidur",
            ar: "عند الاستيقاظ"
        },
        arabic: "الْحَمْدُ للهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilaihin-nushur",
        translation: {
            en: "All praise is due to Allah who gave us life after having given us death and unto Him is the resurrection.",
            id: "Segala puji bagi Allah yang menghidupkan kami sesudah mematikan kami dan kepada-Nya kami kembali.",
            ms: "Segala puji bagi Allah yang menghidupkan kami sesudah mematikan kami dan kepada-Nya kami kembali."
        },
        source: "Bukhari & Muslim"
    },
    {
        id: 3,
        title: {
            en: "Before Eating",
            id: "Sebelum Makan",
            ms: "Sebelum Makan",
            ar: "قبل الأكل"
        },
        arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
        transliteration: "Bismillahi wa 'ala barakatillah",
        translation: {
            en: "In the name of Allah and with the blessings of Allah.",
            id: "Dengan nama Allah dan atas berkah Allah.",
            ms: "Dengan nama Allah dan atas berkah Allah."
        },
        source: "Abu Dawud"
    },
    {
        id: 4,
        title: {
            en: "After Eating",
            id: "Sesudah Makan",
            ms: "Sesudah Makan",
            ar: "بعد الأكل"
        },
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
        transliteration: "Alhamdulillahil-ladhi at'amana wa saqana wa ja'alana muslimin",
        translation: {
            en: "All praise is due to Allah who fed us and gave us drink and made us Muslims.",
            id: "Segala puji bagi Allah yang telah memberi makan dan minum kepada kami dan menjadikan kami orang-orang muslim.",
            ms: "Segala puji bagi Allah yang telah memberi makan dan minum kepada kami dan menjadikan kami orang-orang muslim."
        },
        source: "Abu Dawud"
    },
    {
        id: 5,
        title: {
            en: "Entering Mosque",
            id: "Masuk Masjid",
            ms: "Masuk Masjid",
            ar: "دخول المسجد"
        },
        arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        transliteration: "Allahummaf-tah li abwaba rahmatik",
        translation: {
            en: "O Allah, open the gates of Your mercy for me.",
            id: "Ya Allah, bukalah untukku pintu-pintu rahmat-Mu.",
            ms: "Ya Allah, bukalah untukku pintu-pintu rahmat-Mu."
        },
        source: "Muslim"
    }
]
