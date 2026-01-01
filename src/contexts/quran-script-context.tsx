'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type QuranScriptType =
    | 'tajweed'
    | 'uthmani'
    | 'indopak'
    | 'simple'
    | 'simple-enhanced'
    | 'simple-min'
    | 'uthmani-min'
    | 'unicode'
    | 'uthmani-academy'

export interface QuranScript {
    id: QuranScriptType
    name: string
    nameArabic: string
    description: string
    apiEdition: string
}

export const QURAN_SCRIPTS: QuranScript[] = [
    {
        id: 'tajweed',
        name: 'Tajweed (Berwarna)',
        nameArabic: 'المجود ملون',
        description: 'Quran dengan warna tajweed untuk membantu bacaan',
        apiEdition: 'quran-tajweed'
    },
    {
        id: 'uthmani',
        name: 'Uthmani',
        nameArabic: 'رسم العثماني',
        description: 'Rasm Uthmani standar (paling umum)',
        apiEdition: 'quran-uthmani'
    },
    {
        id: 'simple',
        name: 'Simple',
        nameArabic: 'المبسط',
        description: 'Tulisan sederhana dengan tashkil',
        apiEdition: 'quran-simple'
    },

    {
        id: 'simple-enhanced',
        name: 'Simple Enhanced',
        nameArabic: 'المبسط المحسن',
        description: 'Tulisan sederhana yang ditingkatkan',
        apiEdition: 'quran-simple-enhanced'
    },
    {
        id: 'simple-min',
        name: 'Simple Minimal',
        nameArabic: 'المبسط الأدنى',
        description: 'Tulisan sederhana minimal',
        apiEdition: 'quran-simple-min'
    },
    {
        id: 'uthmani-min',
        name: 'Uthmani Minimal',
        nameArabic: 'العثماني الأدنى',
        description: 'Rasm Uthmani dengan tashkil minimal',
        apiEdition: 'quran-uthmani-min'
    },
    {
        id: 'unicode',
        name: 'Unicode',
        nameArabic: 'يونيكود',
        description: 'Quran Unicode dari Khaled Hosny',
        apiEdition: 'quran-unicode'
    },
    {
        id: 'uthmani-academy',
        name: 'Uthmani Academy',
        nameArabic: 'العثماني الأكاديمي',
        description: 'Uthmani untuk font Kitab',
        apiEdition: 'quran-uthmani-quran-academy'
    },

]

interface QuranScriptContextType {
    currentScript: QuranScript
    setScript: (scriptId: QuranScriptType) => void
    scripts: QuranScript[]
}

const QuranScriptContext = createContext<QuranScriptContextType | undefined>(undefined)

const STORAGE_KEY = 'qalbu-quran-script'

export function QuranScriptProvider({ children }: { children: React.ReactNode }) {
    const [currentScript, setCurrentScript] = useState<QuranScript>(QURAN_SCRIPTS[0])

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            const script = QURAN_SCRIPTS.find(s => s.id === saved)
            if (script) {
                setCurrentScript(script)
            }
        }
    }, [])

    const setScript = (scriptId: QuranScriptType) => {
        const script = QURAN_SCRIPTS.find(s => s.id === scriptId)
        if (script) {
            setCurrentScript(script)
            localStorage.setItem(STORAGE_KEY, scriptId)
        }
    }

    return (
        <QuranScriptContext.Provider value={{ currentScript, setScript, scripts: QURAN_SCRIPTS }}>
            {children}
        </QuranScriptContext.Provider>
    )
}

export function useQuranScript() {
    const context = useContext(QuranScriptContext)
    if (context === undefined) {
        throw new Error('useQuranScript must be used within a QuranScriptProvider')
    }
    return context
}
