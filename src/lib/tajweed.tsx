import React from 'react'

export const TAJWEED_META: Record<string, { class: string; color: string; description: string; details: string }> = {
    h: { class: 'ham_wasl', color: '#AAAAAA', description: 'Hamzat ul Wasl', details: 'The connecting Hamzah. It is dropped when continuing from the previous word.' },
    s: { class: 'slnt', color: '#AAAAAA', description: 'Silent Letter', details: 'This letter is written but not pronounced.' },
    l: { class: 'slnt', color: '#AAAAAA', description: 'Lam Shamsiyyah', details: 'The Lam is not pronounced; the following letter is emphasized (doubled).' },
    n: { class: 'madda_normal', color: '#537FFF', description: 'Normal Prolongation', details: 'Prolong the sound for 2 vowel counts (Harakah).' },
    p: { class: 'madda_permissible', color: '#4050FF', description: 'Permissible Prolongation', details: 'You may prolong the sound for 2, 4, or 6 vowel counts.' },
    m: { class: 'madda_necessary', color: '#000EBC', description: 'Necessary Prolongation', details: 'You must prolong the sound for 6 vowel counts.' },
    q: { class: 'qlq', color: '#DD0008', description: 'Qalaqah', details: 'Echoing or bouncing sound when the letter has a Sukoon or is at a stop.' },
    o: { class: 'madda_obligatory', color: '#2144C1', description: 'Obligatory Prolongation', details: 'Prolong the sound for 4 or 5 vowel counts.' },
    c: { class: 'ikhf_shfw', color: '#D500B7', description: 'Ikhfa\' Shafawi', details: 'Conceal the Meem sound with a nasal sound (Ghunnah) when followed by Baa.' },
    f: { class: 'ikhf', color: '#9400A8', description: 'Ikhfa\'', details: 'Hide the Noon sound and make a nasal sound (Ghunnah) when followed by specific letters.' },
    w: { class: 'idghm_shfw', color: '#58B800', description: 'Idgham Shafawi', details: 'Merge the Meem into the following Meem with a nasal sound.' },
    i: { class: 'iqlb', color: '#26BFFD', description: 'Iqlab', details: 'Change the Noon sound into a Meem sound with a nasal sound (Ghunnah).' },
    a: { class: 'idgh_ghn', color: '#169777', description: 'Idgham with Ghunnah', details: 'Merge the letter into the next one with a nasal sound.' },
    u: { class: 'idgh_w_ghn', color: '#169200', description: 'Idgham without Ghunnah', details: 'Merge the letter into the next one without a nasal sound.' },
    d: { class: 'idgh_mus', color: '#A1A1A1', description: 'Idgham Mutajanisayn', details: 'Merging of two letters that share the same articulation point but differ in characteristics.' },
    b: { class: 'idgh_mus', color: '#A1A1A1', description: 'Idgham Mutaqaribayn', details: 'Merging of two letters that are close in articulation point and characteristics.' },
    g: { class: 'ghn', color: '#FF7E1E', description: 'Ghunnah', details: 'A nasal sound produced from the nose, held for 2 vowel counts.' },
}

export function parseTajweed(text: string, onTajweedClick?: (meta: typeof TAJWEED_META[string]) => void): React.ReactNode[] {
    const parts = text.split(/(\[[a-z](?::\d+)?\[[^\]]+\])/g)

    return parts.map((part, index) => {
        const match = part.match(/^\[([a-z])(?::\d+)?\[([^\]]+)\]$/)
        if (match) {
            const key = match[1]
            const content = match[2]
            const meta = TAJWEED_META[key]

            if (meta) {
                return (
                    <span
                        key={index}
                        className={`tajweed-${meta.class} ${onTajweedClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                        style={{ color: meta.color }}
                        title={meta.description}
                        onClick={(e) => {
                            if (onTajweedClick) {
                                e.stopPropagation()
                                onTajweedClick(meta)
                            }
                        }}
                    >
                        {content}
                    </span>
                )
            }
        }
        return <span key={index}>{part}</span>
    })
}
