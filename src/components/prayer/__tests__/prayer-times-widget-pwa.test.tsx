import { render, screen } from '@testing-library/react'
import { PrayerTimesWidgetPWA } from '../prayer-times-widget-pwa'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'

// Mock dependencies
vi.mock('@/hooks/use-prayer-times', () => ({
    usePrayerTimes: vi.fn(),
}))

vi.mock('@/contexts/language-context', () => ({
    useLanguage: vi.fn(() => ({
        t: {
            common: { error: 'Error' },
            prayer: { unknown: 'Unknown Location', fajr: 'Fajr', sunrise: 'Sunrise', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' }
        },
    })),
}))

import { usePrayerTimes } from '@/hooks/use-prayer-times'

describe('PrayerTimesWidgetPWA', () => {
    it('renders loading state', () => {
        (usePrayerTimes as any).mockReturnValue({
            isLoading: true,
            prayerTimes: null,
            error: null,
        })

        const { container } = render(<PrayerTimesWidgetPWA />)
        // Check for loader icon or structure
        // Since we can't easily query by class in simple setup without setup, we rely on implementation details or just that it renders *something* loading-like
        // But better to check if main content is NOT there
        expect(screen.queryByText('Fajr')).not.toBeInTheDocument()
    })

    it('renders error state', () => {
        (usePrayerTimes as any).mockReturnValue({
            isLoading: false,
            prayerTimes: null,
            error: 'Failed to fetch',
        })

        render(<PrayerTimesWidgetPWA />)
        expect(screen.getByText('Error')).toBeInTheDocument()
        expect(screen.getByText('Failed to fetch')).toBeInTheDocument()
    })

    it('renders prayer times', () => {
        (usePrayerTimes as any).mockReturnValue({
            isLoading: false,
            prayerTimes: {
                timings: {
                    Fajr: '05:00',
                    Sunrise: '06:00',
                    Dhuhr: '12:00',
                    Asr: '15:00',
                    Maghrib: '18:00',
                    Isha: '19:00',
                },
                date: {
                    hijri: {
                        day: '1',
                        month: { en: 'Ramadan' },
                        year: '1445',
                    },
                },
            },
            error: null,
            locationName: { city: 'Jakarta', country: 'Indonesia' },
        })

        render(<PrayerTimesWidgetPWA />)
        expect(screen.getByText('Jakarta, Indonesia')).toBeInTheDocument()
        expect(screen.getByText('Fajr')).toBeInTheDocument()
        expect(screen.getByText('05:00')).toBeInTheDocument()
        expect(screen.getByText('1 Ramadan 1445')).toBeInTheDocument()
    })
})
