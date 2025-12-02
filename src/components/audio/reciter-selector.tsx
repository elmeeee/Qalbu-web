'use client'

import { useAudio } from '@/contexts/audio-context'
import { getAvailableReciters, Reciter } from '@/lib/reciters'
import { Check, ChevronDown, Mic2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function ReciterSelector() {
    const { selectedReciter, changeReciter } = useAudio()
    const [reciters, setReciters] = useState<Reciter[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getAvailableReciters().then(data => {
            setReciters(data)
            setIsLoading(false)
        })
    }, [])

    const currentReciter = reciters.find(r => r.identifier === selectedReciter)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
                    <Mic2 className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[100px]">
                        {isLoading ? 'Loading...' : (currentReciter?.englishName.split(' ')[0] || 'Reciter')}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px] max-h-[300px] overflow-y-auto z-[100]">
                {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                ) : (
                    reciters.map((reciter) => (
                        <DropdownMenuItem
                            key={reciter.identifier}
                            onClick={() => changeReciter(reciter.identifier)}
                            className="flex items-center justify-between gap-2 cursor-pointer"
                        >
                            <div className="flex flex-col gap-0.5">
                                <span className="font-medium text-sm truncate max-w-[180px]">{reciter.englishName}</span>
                                <span className="text-[10px] text-muted-foreground">{reciter.identifier}</span>
                            </div>
                            {selectedReciter === reciter.identifier && (
                                <Check className="h-4 w-4 text-emerald-500" />
                            )}
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
