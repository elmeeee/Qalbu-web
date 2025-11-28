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
            nl: { name: "Takbiratul Ihram", terjemah: "Allah is de Grootste" },
            zh: { name: "入拜大赞", terjemah: "真主至大" },
            ja: { name: "タクビール", terjemah: "アッラーは偉大なり" },
            ko: { name: "탁비라툴 이흐람", terjemah: "알라는 위대하시다" },
            vi: { name: "Takbiratul Ihram", terjemah: "Allah là Đấng Vĩ đại nhất" },
            th: { name: "ตักบีรatul Ihram", terjemah: "อัลลอฮ์ทรงยิ่งใหญ่ที่สุด" }
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
            nl: { name: "Ruku'", terjemah: "Glorie aan mijn Heer de Almachtige" },
            zh: { name: "鞠躬", terjemah: "赞颂我伟大的主清净" },
            ja: { name: "ルクー（立礼）", terjemah: "偉大なる我が主に栄光あれ" },
            ko: { name: "루쿠", terjemah: "위대하신 나의 주님께 영광을" },
            vi: { name: "Ruku'", terjemah: "Vinh quang thay Chúa tể Toàn năng của tôi" },
            th: { name: "รุกู", terjemah: "มหาบริสุทธิ์แด่พระเจ้าของข้าพระองค์ ผู้ทรงยิ่งใหญ่" }
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
            nl: { name: "I'tidal", terjemah: "Allah hoort degenen die Hem prijzen" },
            zh: { name: "鞠躬后站立", terjemah: "真主听到赞颂他的人" },
            ja: { name: "イティダール", terjemah: "アッラーは彼を称える者の声を聞かれる" },
            ko: { name: "이티달", terjemah: "알라께서는 그를 찬양하는 자의 소리를 들으신다" },
            vi: { name: "I'tidal", terjemah: "Allah nghe thấy những ai ca ngợi Ngài" },
            th: { name: "อิ'ติฎาล", terjemah: "อัลลอฮ์ทรงได้ยินผู้ที่สรรเสริญพระองค์" }
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
            nl: { name: "Sujud", terjemah: "Glorie aan mijn Heer de Allerhoogste" },
            zh: { name: "叩头", terjemah: "赞颂我至高的主清净" },
            ja: { name: "スジュード（平伏）", terjemah: "至高なる我が主に栄光あれ" },
            ko: { name: "수주드", terjemah: "지극히 높으신 나의 주님께 영광을" },
            vi: { name: "Sujud", terjemah: "Vinh quang thay Chúa tể Tối cao của tôi" },
            th: { name: "สุญูด", terjemah: "มหาบริสุทธิ์แด่พระเจ้าของข้าพระองค์ ผู้ทรงสูงสุด" }
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
            nl: { name: "Zitten tussen twee Sujoods", terjemah: "Mijn Heer, vergeef mij en heb genade met mij" },
            zh: { name: "两叩之间坐", terjemah: "我的主啊，求你饶恕我，慈悯我" },
            ja: { name: "二つのスジュードの間の座り", terjemah: "我が主よ、私を許し、私に慈悲をお与えください" },
            ko: { name: "두 수주드 사이에 앉기", terjemah: "나의 주님, 저를 용서하시고 자비를 베푸소서" },
            vi: { name: "Ngồi giữa hai Sujud", terjemah: "Lạy Chúa, xin tha thứ cho con và thương xót con" },
            th: { name: "นั่งระหว่างสองสุญูด", terjemah: "โอ้พระเจ้าของข้าพระองค์ โปรดอภัยให้ข้าพระองค์ และเมตตาข้าพระองค์" }
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
            nl: { name: "Tashahhud", terjemah: "Alle groeten, gebeden en goede woorden komen toe aan Allah" },
            zh: { name: "作证词", terjemah: "一切敬意、祷告和美好的言辞都归于真主" },
            ja: { name: "タシャッフド", terjemah: "すべての敬意、祈り、そして善き言葉はアッラーに帰す" },
            ko: { name: "타샤후드", terjemah: "모든 경의와 기도와 선한 말은 알라께 속합니다" },
            vi: { name: "Tashahhud", terjemah: "Mọi lời khen ngợi, cầu nguyện và lời nói thuần khiết đều thuộc về Allah" },
            th: { name: "ตะชะฮุด", terjemah: "การคารวะทั้งหลาย การละหมาด และสิ่งดีงามทั้งหลาย เป็นสิทธิ์ของอัลลอฮ์" }
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
            nl: { name: "Salam", terjemah: "Vrede zij met u en de genade van Allah" },
            zh: { name: "祝安词", terjemah: "愿真主的平安和慈悯在你们上" },
            ja: { name: "サラーム", terjemah: "あなた方に平安とアッラーの慈悲がありますように" },
            ko: { name: "살람", terjemah: "당신에게 평화와 알라의 자비가 있기를" },
            vi: { name: "Salam", terjemah: "Bình an và lòng thương xót của Allah ở cùng bạn" },
            th: { name: "สลาม", terjemah: "ขอความสันติและความเมตตาจากอัลลอฮ์จงมีแด่ท่าน" }
        }
    }
];
