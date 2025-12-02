import { render, screen, waitFor } from '@testing-library/react'
import { NearbyMosqueCard } from '../mosque-card'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'

// Mock dependencies
vi.mock('@/hooks/use-prayer-times', () => ({
    usePrayerTimes: vi.fn(),
}))

vi.mock('@/lib/api/mosques', () => ({
    getNearbyMosques: vi.fn(),
}))

import { usePrayerTimes } from '@/hooks/use-prayer-times'
import { getNearbyMosques } from '@/lib/api/mosques'

describe('NearbyMosqueCard', () => {
    it('renders loading state', () => {
        (usePrayerTimes as any).mockReturnValue({
            coordinates: { latitude: 0, longitude: 0 },
            error: null,
        });
        (getNearbyMosques as any).mockReturnValue(new Promise(() => { }))

        render(<NearbyMosqueCard />)
        // Check for loader
        expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('renders error state when location denied', () => {
        (usePrayerTimes as any).mockReturnValue({
            coordinates: null,
            error: 'Permission denied',
        })

        render(<NearbyMosqueCard />)
        expect(screen.getByText('Location access needed')).toBeInTheDocument()
    })

    it('renders mosque data', async () => {
        (usePrayerTimes as any).mockReturnValue({
            coordinates: { latitude: 1, longitude: 1 },
            error: null,
        });
        (getNearbyMosques as any).mockResolvedValue([
            {
                lat: 1,
                lon: 1,
                tags: { name: 'Test Mosque', 'addr:street': 'Test Street' },
                distance: 0.5,
            },
        ])

        render(<NearbyMosqueCard />)

        await waitFor(() => {
            expect(screen.getByText('Test Mosque')).toBeInTheDocument()
            expect(screen.getByText('Test Street')).toBeInTheDocument()
            expect(screen.getByText('0.5 km')).toBeInTheDocument()
        })
    })
})
