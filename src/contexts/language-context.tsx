'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language, translations } from '@/lib/i18n'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: typeof translations['en']
    dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en')
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Initialize from URL or localStorage
    useEffect(() => {
        const urlLang = searchParams.get('lang') as Language
        const savedLang = localStorage.getItem('language') as Language
        const supportedLangs = ['en', 'ms', 'id', 'vi', 'th', 'zh', 'ko', 'nl', 'ja']

        if (urlLang && supportedLangs.includes(urlLang)) {
            setLanguageState(urlLang)
        } else if (savedLang && supportedLangs.includes(savedLang)) {
            setLanguageState(savedLang)
        }
    }, [searchParams])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem('language', lang)

        // Update URL
        const params = new URLSearchParams(searchParams.toString())
        params.set('lang', lang)
        router.push(`${pathname}?${params.toString()}`)
    }

    const t = translations[language]
    const dir = 'ltr'

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            <div dir={dir} className="contents">
                {children}
            </div>
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
