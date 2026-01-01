'use client'

import { Check, Sparkles } from 'lucide-react'
import { useQuranScript, QURAN_SCRIPTS, type QuranScriptType } from '@/contexts/quran-script-context'
import { cn } from '@/lib/utils'

export function QuranScriptSelector() {
    const { currentScript, setScript } = useQuranScript()

    const handleScriptChange = (scriptId: QuranScriptType) => {
        setScript(scriptId)
    }

    return (
        <div className="space-y-3">
            {QURAN_SCRIPTS.map((script) => {
                const isSelected = currentScript.id === script.id

                return (
                    <button
                        key={script.id}
                        onClick={() => handleScriptChange(script.id)}
                        className={cn(
                            "group w-full relative overflow-hidden rounded-xl transition-all duration-300 text-left",
                            "border-2 backdrop-blur-sm",
                            isSelected
                                ? "border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-transparent shadow-lg shadow-emerald-500/20 scale-[1.02]"
                                : "border-white/10 bg-gradient-to-br from-white/5 to-transparent hover:border-emerald-500/30 hover:bg-white/10 hover:scale-[1.01]"
                        )}
                    >
                        {/* Animated gradient overlay */}
                        {isSelected && (
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-400/10 to-emerald-500/0 animate-shimmer" />
                        )}

                        <div className="relative flex items-start gap-4 p-4">
                            {/* Custom Radio Button */}
                            <div className="flex-shrink-0 mt-1">
                                <div className={cn(
                                    "relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                    isSelected
                                        ? "border-emerald-500 bg-emerald-500 shadow-lg shadow-emerald-500/50"
                                        : "border-gray-500 group-hover:border-emerald-400"
                                )}>
                                    {isSelected && (
                                        <Check className="h-3 w-3 text-white animate-in zoom-in duration-200" strokeWidth={3} />
                                    )}
                                    {isSelected && (
                                        <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <h3 className={cn(
                                        "font-semibold text-base transition-colors",
                                        isSelected ? "text-white" : "text-gray-100 group-hover:text-white"
                                    )}>
                                        {script.name}
                                    </h3>
                                    {isSelected && (
                                        <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                                    )}
                                </div>

                                {/* Arabic Name */}
                                <p className={cn(
                                    "text-lg font-arabic mb-2 transition-colors",
                                    isSelected ? "text-emerald-200" : "text-gray-400 group-hover:text-gray-300"
                                )} dir="rtl">
                                    {script.nameArabic}
                                </p>

                                {/* Description */}
                                <p className={cn(
                                    "text-sm leading-relaxed transition-colors",
                                    isSelected ? "text-gray-300" : "text-gray-500 group-hover:text-gray-400"
                                )}>
                                    {script.description}
                                </p>
                            </div>
                        </div>

                        {/* Bottom accent line */}
                        {isSelected && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                        )}
                    </button>
                )
            })}
        </div>
    )
}
