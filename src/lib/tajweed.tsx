import React from 'react'
import { translations, type Language } from './i18n'

// Minimal meta for styling, descriptions moved to i18n
export const TAJWEED_META: Record<string, { class: string; color: string }> = {
    h: { class: 'ham_wasl', color: '#AAAAAA' },
    s: { class: 'slnt', color: '#AAAAAA' },
    l: { class: 'slnt', color: '#AAAAAA' },
    n: { class: 'madda_normal', color: '#537FFF' },
    p: { class: 'madda_permissible', color: '#4050FF' },
    m: { class: 'madda_necessary', color: '#000EBC' },
    q: { class: 'qlq', color: '#DD0008' },
    o: { class: 'madda_obligatory', color: '#2144C1' },
    c: { class: 'ikhf_shfw', color: '#D500B7' },
    f: { class: 'ikhf', color: '#9400A8' },
    w: { class: 'idghm_shfw', color: '#58B800' },
    i: { class: 'iqlb', color: '#26BFFD' },
    a: { class: 'idgh_ghn', color: '#169777' },
    u: { class: 'idgh_w_ghn', color: '#169200' },
    d: { class: 'idgh_mus', color: '#A1A1A1' },
    b: { class: 'idgh_mus', color: '#A1A1A1' },
    g: { class: 'ghn', color: '#FF7E1E' },
}

export type TajweedMeta = {
    class: string
    color: string
    description: string
    details: string
}

export function parseTajweed(
    text: string,
    onTajweedClick?: (meta: TajweedMeta) => void,
    language: Language = 'en'
): React.ReactNode[] {
    const parts = text.split(/(\[[a-z](?::\d+)?\[[^\]]+\])/g)

    // Get the dictionary for the current language, fallback to English
    const dict = translations[language as keyof typeof translations] || translations.en
    const tajweedDict = (dict as any).tajweed || (translations.en as any).tajweed // safe fallback

    return parts.map((part, index) => {
        const match = part.match(/^\[([a-z])(?::\d+)?\[([^\]]+)\]$/)
        if (match) {
            const key = match[1]
            const content = match[2]
            const metaStyle = TAJWEED_META[key]
            const metaText = tajweedDict?.[key]

            if (metaStyle && metaText) {
                const combinedMeta: TajweedMeta = {
                    ...metaStyle,
                    description: metaText.description,
                    details: metaText.details
                }

                return (
                    <span
                        key={index}
                        className={`tajweed-${metaStyle.class} ${onTajweedClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                        style={{ color: metaStyle.color }}
                        title={combinedMeta.description}
                        onClick={(e) => {
                            if (onTajweedClick) {
                                e.stopPropagation()
                                onTajweedClick(combinedMeta)
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
