import { render, screen, act, waitFor } from '@testing-library/react'
import { AudioProvider, useAudio } from '../audio-context'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'

// Mock Audio
const mockPlay = vi.fn(() => Promise.resolve())
const mockPause = vi.fn()
const mockLoad = vi.fn()

const AudioMock = vi.fn(() => ({
    play: mockPlay,
    pause: mockPause,
    load: mockLoad,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    src: '',
    currentTime: 0,
    duration: 0,
    preload: 'auto',
}))

vi.stubGlobal('Audio', AudioMock)

// Mock Media Session
const mockSetActionHandler = vi.fn()
Object.defineProperty(navigator, 'mediaSession', {
    writable: true,
    value: {
        setActionHandler: mockSetActionHandler,
        metadata: null,
    },
})

// Mock MediaMetadata
vi.stubGlobal('MediaMetadata', vi.fn())

// Test Component to consume context
const TestComponent = () => {
    const { isPlaying, playAyah, togglePlay } = useAudio()
    return (
        <div>
            <div data-testid="is-playing">{isPlaying.toString()}</div>
            <button onClick={() => playAyah({ number: 1, englishName: 'Test Surah', ayahs: [] } as any, { number: 1, audio: 'test.mp3', numberInSurah: 1 } as any)}>
                Play Ayah
            </button>
            <button onClick={togglePlay}>Toggle Play</button>
        </div>
    )
}

describe('AudioContext', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('provides initial state', () => {
        render(
            <AudioProvider>
                <TestComponent />
            </AudioProvider>
        )
        expect(screen.getByTestId('is-playing')).toHaveTextContent('false')
    })

    it('plays ayah correctly', async () => {
        render(
            <AudioProvider>
                <TestComponent />
            </AudioProvider>
        )

        await act(async () => {
            screen.getByText('Play Ayah').click()
        })

        expect(mockPlay).toHaveBeenCalled()
        expect(screen.getByTestId('is-playing')).toHaveTextContent('true')
    })

    it('toggles play state', async () => {
        render(
            <AudioProvider>
                <TestComponent />
            </AudioProvider>
        )

        // First play something to have currentAyah
        await act(async () => {
            screen.getByText('Play Ayah').click()
        })
        expect(screen.getByTestId('is-playing')).toHaveTextContent('true')

        // Then toggle
        await act(async () => {
            screen.getByText('Toggle Play').click()
        })
        expect(mockPause).toHaveBeenCalled()
        expect(screen.getByTestId('is-playing')).toHaveTextContent('false')
    })
})
