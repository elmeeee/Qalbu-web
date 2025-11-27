'use client'
// Slider component

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SliderProps {
    value: number[]
    max: number
    step: number
    onValueChange: (value: number[]) => void
    className?: string
}

export function Slider({ value, max, step, onValueChange, className }: SliderProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange([parseFloat(e.target.value)])
    }

    return (
        <div className={cn('relative flex w-full touch-none select-none items-center', className)}>
            <input
                type="range"
                min={0}
                max={max}
                step={step}
                value={value[0]}
                onChange={handleChange}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
            />
        </div>
    )
}
