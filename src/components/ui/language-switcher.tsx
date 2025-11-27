'use client'

import { useLanguage } from '@/contexts/language-context'
import { languages, Language } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Change Language"
            >
                <Globe className="h-5 w-5" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border/50 bg-background/95 p-1 shadow-xl backdrop-blur-lg z-50"
                    >
                        <div className="flex flex-col gap-1">
                            {(Object.entries(languages) as [Language, string][]).map(([code, name]) => (
                                <button
                                    key={code}
                                    onClick={() => {
                                        setLanguage(code)
                                        setIsOpen(false)
                                    }}
                                    className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${language === code
                                            ? 'bg-gold-500/10 text-gold-600 font-medium'
                                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                        }`}
                                >
                                    <span className="flex-1 text-left">{name}</span>
                                    {language === code && (
                                        <motion.div
                                            layoutId="activeLanguage"
                                            className="h-1.5 w-1.5 rounded-full bg-gold-500"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
