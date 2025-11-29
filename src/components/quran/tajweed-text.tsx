import React from 'react'

interface TajweedTextProps {
    text: string
    className?: string
}

export function TajweedText({ text, className }: TajweedTextProps) {
    // Regex to match [code:id[text] or [code[text]
    // Examples: [h:1[\u0671], [n[\u0640\u0670], [l[\u0644]
    const regex = /(\[[a-z]+(?::\d+)?\[[^\]]+\])/g
    if (!text) return null

    // Debug logging
    // console.log('TajweedText input:', text.substring(0, 50))
    const parts = text.split(regex)
    // console.log('TajweedText parts:', parts.length)


    return (
        <span className={className}>
            {parts.map((part, index) => {
                const match = part.match(/^\[([a-z]+)(?::(\d+))?\[([^\]]+)\]$/)
                if (match) {
                    const [, code, , content] = match
                    return (
                        <span key={index} className={`tajweed-${code}`}>
                            {content}
                        </span>
                    )
                }
                return <span key={index}>{part}</span>
            })}
        </span>
    )
}
