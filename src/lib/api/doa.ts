import { Language } from '../i18n';

export interface DoaItem {
    id: number
    judul: string
    latin: string
    arab: string
    terjemah: string
}

const translationIds: { [key in Language]?: number } = {
    ms: 39,  // Abdullah Muhammad Basmeih
    en: 20,  // Saheeh International
    ja: 218, // Saeed Sato
    nl: 144, // Sofian S. Siregar
    id: 33,  // Indonesian Ministry
    vi: 221, // Hasan Abdul-Karim
    th: 51,  // King Fahad Quran Complex
    zh: 109, // Muhammad Makin
    ko: 219, // Hamed Choi
}

// Selected verses that are commonly used as Duas
const duaVerses = [
    { key: '2:201', title: { ms: 'Doa Kebaikan Dunia Akhirat', en: 'Dua for Good in Both Worlds', ja: '現世と来世の善を求める祈り', nl: 'Smeekbede voor het goede in beide werelden', id: 'Doa Sapu Jagat', vi: 'Lời cầu nguyện cho sự tốt lành ở cả hai thế giới', th: 'ดุอาขอความดีทั้งในโลกนี้และโลกหน้า', zh: '求两世吉庆的祈祷', ko: '현세와 내세의 선을 위한 기도' } },
    { key: '3:8', title: { ms: 'Doa Keteguhan Iman', en: 'Dua for Firmness in Faith', ja: '信仰の堅固さを求める祈り', nl: 'Smeekbede voor standvastigheid in het geloof', id: 'Doa Keteguhan Iman', vi: 'Lời cầu nguyện cho sự kiên định trong đức tin', th: 'ดุอาขอความมั่นคงในศรัทธา', zh: '求坚定信仰的祈祷', ko: '신앙의 확고함을 위한 기도' } },
    { key: '23:109', title: { ms: 'Doa Mohon Keampunan dan Rahmat', en: 'Dua for Forgiveness and Mercy', ja: '許しと慈悲を求める祈り', nl: 'Smeekbede voor vergeving en genade', id: 'Doa Mohon Ampun dan Rahmat', vi: 'Lời cầu nguyện xin tha thứ và lòng thương xót', th: 'ดุอาขอการอภัยโทษและความเมตตา', zh: '求饶恕和慈悯的祈祷', ko: '용서와 자비를 위한 기도' } },
    { key: '25:74', title: { ms: 'Doa untuk Keluarga', en: 'Dua for Family', ja: '家族のための祈り', nl: 'Smeekbede voor het gezin', id: 'Doa untuk Keluarga', vi: 'Lời cầu nguyện cho gia đình', th: 'ดุอาสำหรับครอบครัว', zh: '为家庭祈祷', ko: '가족을 위한 기도' } },
    { key: '59:10', title: { ms: 'Doa untuk Orang Beriman', en: 'Dua for Believers', ja: '信者のための祈り', nl: 'Smeekbede voor de gelovigen', id: 'Doa untuk Orang Beriman', vi: 'Lời cầu nguyện cho các tín đồ', th: 'ดุอาสำหรับผู้ศรัทธา', zh: '为信士祈祷', ko: '신자들을 위한 기도' } },
    { key: '21:87', title: { ms: 'Doa Nabi Yunus', en: 'Dua of Prophet Yunus', ja: '預言者ユヌスの祈り', nl: 'Smeekbede van Profeet Yunus', id: 'Doa Nabi Yunus', vi: 'Lời cầu nguyện của Tiên tri Yunus', th: 'ดุอาของศาสดายูนุส', zh: '先知尤努斯的祈祷', ko: '예언자 유누스의 기도' } },
]

export async function getDoas(language: Language = 'en'): Promise<DoaItem[]> {
    try {
        const translationId = translationIds[language] || translationIds['en'];
        const promises = duaVerses.map(async (item, index) => {
            const url = `https://api.quran.com/api/v4/verses/by_key/${item.key}?language=${language}&fields=text_uthmani,text_imlaei&translations=${translationId}`;
            const response = await fetch(url);
            if (!response.ok) return null;
            const data = await response.json();
            const verse = data.verse;

            // Extract translation text
            const translation = verse.translations?.[0]?.text || '';
            // Clean up translation (remove HTML tags if any)
            const cleanTranslation = translation.replace(/<[^>]*>?/gm, '');

            return {
                id: index + 1,
                judul: (item.title as any)[language] || item.title['en'],
                latin: '', // Quran.com API doesn't provide easy transliteration in this endpoint, leaving empty or could fetch separately
                arab: verse.text_uthmani,
                terjemah: cleanTranslation
            };
        });

        const results = await Promise.all(promises);
        return results.filter((item): item is DoaItem => item !== null);
    } catch (error) {
        console.error('Error fetching doas from Quran.com:', error);
        return [];
    }
}
