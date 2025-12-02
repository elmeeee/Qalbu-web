import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { DailyDuaSlider } from '../dua-slider'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'

const mocks = vi.hoisted(() => ({
    getRandomDailyDuas: vi.fn(),
}))

// Mock dependencies
vi.mock('@/lib/api/doa', () => ({
    getRandomDailyDuas: mocks.getRandomDailyDuas,
}))

vi.mock('html2canvas', () => ({
    default: vi.fn(() => Promise.resolve(document.createElement('canvas'))),
}))

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}))


describe('DailyDuaSlider', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders loading state initially', () => {
        mocks.getRandomDailyDuas.mockReturnValue(new Promise(() => { })) // Never resolves
        render(<DailyDuaSlider />)
        // Check for pulse animation class or structure
        const loader = document.querySelector('.animate-pulse')
        expect(loader).toBeInTheDocument()
    })

    it.skip('renders duas after loading', async () => {
        const mockDuas = [
            {
                id: '1',
                grup: 'Morning',
                ar: 'Arabic Text',
                tr: 'Transliteration',
                idn: 'Translation',
            },
        ];

        mocks.getRandomDailyDuas.mockResolvedValue(mockDuas)

        render(<DailyDuaSlider />)

        await waitFor(() => {
            expect(mocks.getRandomDailyDuas).toHaveBeenCalled()
        })

        await waitFor(() => {
            expect(screen.queryByText('Morning')).toBeInTheDocument()
        }, { timeout: 3000 })
        expect(screen.getByText('Arabic Text')).toBeInTheDocument()
        expect(screen.getByText('Translation')).toBeInTheDocument()
    })

    it.skip('navigates between duas', async () => {
        const mockDuas = [
            { id: '1', grup: 'Dua 1', ar: 'Ar 1', tr: 'Tr 1', idn: 'Idn 1' },
            { id: '2', grup: 'Dua 2', ar: 'Ar 2', tr: 'Tr 2', idn: 'Idn 2' },
        ];
        mocks.getRandomDailyDuas.mockResolvedValue(mockDuas)

        render(<DailyDuaSlider />)

        await waitFor(() => {
            expect(screen.queryByText('Dua 1')).toBeInTheDocument()
        }, { timeout: 3000 })

        // Find next button (ChevronRight is the second button in the header controls)
        // The structure is: Header -> div(Title) -> div(Prev, Next)
        // So we can look for the button that contains the ChevronRight icon or just the 3rd button overall (Share, Prev, Next)
        // Let's try to get by role 'button' and pick the last one
        const buttons = screen.getAllByRole('button')
        const nextButton = buttons[buttons.length - 1]

        fireEvent.click(nextButton)

        await waitFor(() => {
            expect(screen.getByText('Dua 2')).toBeInTheDocument()
        })
    })
})
