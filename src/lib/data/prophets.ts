export interface Prophet {
    id: number
    name: string
    title: {
        en: string
        id: string
        ms: string
        ar: string
    }
    summary: {
        en: string
        id: string
        ms: string
    }
    story: {
        en: string
        id: string
        ms: string
    }
}

export const prophets: Prophet[] = [
    {
        id: 1,
        name: "Adam",
        title: {
            en: "Prophet Adam (AS)",
            id: "Nabi Adam (AS)",
            ms: "Nabi Adam (AS)",
            ar: "آدم عليه السلام"
        },
        summary: {
            en: "The first human and the first prophet of Islam.",
            id: "Manusia pertama dan nabi pertama dalam Islam.",
            ms: "Manusia pertama dan nabi pertama dalam Islam."
        },
        story: {
            en: "Adam (AS) was the first human created by Allah SWT from clay. He lived in Paradise with his wife Hawwa (Eve) until they were deceived by Iblis (Satan) to eat from the forbidden tree. They were sent down to Earth as vicegerents (khalifah). Adam's story teaches us about repentance and Allah's infinite mercy.",
            id: "Adam (AS) adalah manusia pertama yang diciptakan oleh Allah SWT dari tanah liat. Beliau tinggal di Surga bersama istrinya Hawa sampai mereka diperdaya oleh Iblis untuk memakan buah dari pohon terlarang. Mereka diturunkan ke Bumi sebagai khalifah. Kisah Adam mengajarkan kita tentang taubat dan rahmat Allah yang tak terbatas.",
            ms: "Adam (AS) adalah manusia pertama yang diciptakan oleh Allah SWT dari tanah liat. Beliau tinggal di Syurga bersama isterinya Hawa sehingga mereka diperdaya oleh Iblis untuk memakan buah dari pohon terlarang. Mereka diturunkan ke Bumi sebagai khalifah. Kisah Adam mengajar kita tentang taubat dan rahmat Allah yang tidak terbatas."
        }
    },
    {
        id: 2,
        name: "Idris",
        title: {
            en: "Prophet Idris (AS)",
            id: "Nabi Idris (AS)",
            ms: "Nabi Idris (AS)",
            ar: "إدريس عليه السلام"
        },
        summary: {
            en: "Known for his wisdom and being the first to write with a pen.",
            id: "Dikenal karena kebijaksanaannya dan menjadi orang pertama yang menulis dengan pena.",
            ms: "Dikenal kerana kebijaksanaannya dan menjadi orang pertama yang menulis dengan pena."
        },
        story: {
            en: "Idris (AS) was a prophet who came after Adam and Seth. He was known for his truthfulness and patience. He is believed to be the first person to invent writing and sew clothes. Allah exalted him to a high station.",
            id: "Idris (AS) adalah seorang nabi yang datang setelah Adam dan Syits. Beliau dikenal karena kejujuran dan kesabarannya. Beliau diyakini sebagai orang pertama yang menemukan tulisan dan menjahit pakaian. Allah mengangkatnya ke martabat yang tinggi.",
            ms: "Idris (AS) adalah seorang nabi yang datang selepas Adam dan Syits. Beliau dikenal kerana kejujuran dan kesabarannya. Beliau diyakini sebagai orang pertama yang mencipta tulisan dan menjahit pakaian. Allah mengangkatnya ke martabat yang tinggi."
        }
    },
    {
        id: 3,
        name: "Nuh",
        title: {
            en: "Prophet Nuh (AS)",
            id: "Nabi Nuh (AS)",
            ms: "Nabi Nuh (AS)",
            ar: "نوح عليه السلام"
        },
        summary: {
            en: "Preached for 950 years and built the Ark.",
            id: "Berdakwah selama 950 tahun dan membangun Bahtera.",
            ms: "Berdakwah selama 950 tahun dan membina Bahtera."
        },
        story: {
            en: "Nuh (AS) called his people to worship Allah alone for 950 years, but only a few believed. Allah commanded him to build an Ark to survive the Great Flood. The flood destroyed the disbelievers, including Nuh's son who refused to embark.",
            id: "Nuh (AS) menyeru kaumnya untuk menyembah Allah saja selama 950 tahun, tetapi hanya sedikit yang beriman. Allah memerintahkannya untuk membangun Bahtera untuk selamat dari Banjir Besar. Banjir itu membinasakan orang-orang kafir, termasuk anak Nuh yang menolak untuk naik.",
            ms: "Nuh (AS) menyeru kaumnya untuk menyembah Allah sahaja selama 950 tahun, tetapi hanya sedikit yang beriman. Allah memerintahkannya untuk membina Bahtera untuk selamat dari Banjir Besar. Banjir itu membinasakan orang-orang kafir, termasuk anak Nuh yang menolak untuk naik."
        }
    },
    // ... Add more prophets as needed (Hud, Saleh, Ibrahim, etc.)
    {
        id: 25,
        name: "Muhammad",
        title: {
            en: "Prophet Muhammad (SAW)",
            id: "Nabi Muhammad (SAW)",
            ms: "Nabi Muhammad (SAW)",
            ar: "محمد صلى الله عليه وسلم"
        },
        summary: {
            en: "The Seal of the Prophets and the Messenger of Allah to all mankind.",
            id: "Penutup para Nabi dan Rasul Allah untuk seluruh umat manusia.",
            ms: "Penutup para Nabi dan Rasul Allah untuk seluruh umat manusia."
        },
        story: {
            en: "Muhammad (SAW) is the final prophet sent by Allah. He received the revelation of the Quran through Angel Jibril over 23 years. His life (Sunnah) is the perfect example for all Muslims. He established Islam in Arabia and his message spread to the corners of the world, teaching monotheism, compassion, and justice.",
            id: "Muhammad (SAW) adalah nabi terakhir yang diutus oleh Allah. Beliau menerima wahyu Al-Quran melalui Malaikat Jibril selama 23 tahun. Kehidupannya (Sunnah) adalah contoh sempurna bagi semua Muslim. Beliau menegakkan Islam di Arab dan risalahnya menyebar ke seluruh penjuru dunia, mengajarkan tauhid, kasih sayang, dan keadilan.",
            ms: "Muhammad (SAW) adalah nabi terakhir yang diutus oleh Allah. Beliau menerima wahyu Al-Quran melalui Malaikat Jibril selama 23 tahun. Kehidupannya (Sunnah) adalah contoh sempurna bagi semua Muslim. Beliau menegakkan Islam di Arab dan risalahnya menyebar ke seluruh penjuru dunia, mengajarkan tauhid, kasih sayang, dan keadilan."
        }
    }
]
