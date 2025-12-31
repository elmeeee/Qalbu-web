'use client'

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { SurahDetail, Ayah, getSurahWithAudio } from '@/lib/api/quran'

interface AudioContextType {
    isPlaying: boolean
    currentSurah: SurahDetail | null
    currentAyah: Ayah | null
    progress: number
    duration: number
    isLoading: boolean
    selectedReciter: string
    changeReciter: (reciterId: string) => void
    playAyah: (surah: SurahDetail, ayah: Ayah) => void
    togglePlay: () => void
    playNext: () => void
    playPrevious: () => void
    seek: (time: number) => void
}

// Add global declaration for TypeScript if needed, though usually available in modern envs
// declare global {
//     interface Navigator {
//         mediaSession?: MediaSession;
//     }
//     interface Window {
//         MediaSession?: any;
//     }
// }

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentSurah, setCurrentSurah] = useState<SurahDetail | null>(null)
    const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedReciter, setSelectedReciter] = useState('ar.alafasy')
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Load saved reciter
    useEffect(() => {
        const saved = localStorage.getItem('selectedReciter')
        if (saved) setSelectedReciter(saved)
    }, [])

    const changeReciter = useCallback((reciterId: string) => {
        setSelectedReciter(reciterId)
        localStorage.setItem('selectedReciter', reciterId)
    }, [])

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio()
        const audio = audioRef.current

        // Important for background audio on some devices
        audio.preload = 'auto'
        // @ts-ignore - playsInline is not in standard definition but helps on some iOS versions
        audio.playsInline = true

        const handleTimeUpdate = () => setProgress(audio.currentTime)
        const handleLoadedMetadata = () => setDuration(audio.duration)
        const handleEnded = () => {
            setIsPlaying(false)
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'none'
            }
            playNext()
        }
        const handleCanPlay = () => setIsLoading(false)
        const handleWaiting = () => setIsLoading(true)
        const handlePlay = () => {
            setIsPlaying(true)
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'playing'
            }
        }
        const handlePause = () => {
            setIsPlaying(false)
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'paused'
            }
        }

        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('loadedmetadata', handleLoadedMetadata)
        audio.addEventListener('ended', handleEnded)
        audio.addEventListener('canplay', handleCanPlay)
        audio.addEventListener('waiting', handleWaiting)
        audio.addEventListener('play', handlePlay)
        audio.addEventListener('pause', handlePause)

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate)
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
            audio.removeEventListener('ended', handleEnded)
            audio.removeEventListener('canplay', handleCanPlay)
            audio.removeEventListener('waiting', handleWaiting)
            audio.removeEventListener('play', handlePlay)
            audio.removeEventListener('pause', handlePause)
            audio.pause()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Empty dependency array is intentional - we use playNextRef for the callback

    const playAyah = useCallback(async (surah: SurahDetail, ayah: Ayah) => {
        if (!audioRef.current) return

        try {
            setIsLoading(true)
            setCurrentSurah(surah)
            setCurrentAyah(ayah)

            // Use the selected reciter's audio URL
            const audioUrl = `https://cdn.islamic.network/quran/audio/128/${selectedReciter}/${String(surah.number).padStart(3, '0')}${String(ayah.numberInSurah).padStart(3, '0')}.mp3`

            audioRef.current.src = audioUrl
            await audioRef.current.play()
            setIsPlaying(true)

            // Update Media Session Metadata
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: `Surah ${surah.englishName}`,
                    artist: `Ayah ${ayah.numberInSurah}`,
                    album: 'Qalbu Quran',
                    artwork: [
                        { src: '/icons/qalbuIcon.png', sizes: '96x96', type: 'image/png' },
                        { src: '/icons/qalbuIcon.png', sizes: '128x128', type: 'image/png' },
                        { src: '/icons/qalbuIcon.png', sizes: '192x192', type: 'image/png' },
                        { src: '/icons/qalbuIcon.png', sizes: '512x512', type: 'image/png' },
                    ]
                })
                navigator.mediaSession.playbackState = 'playing'
            }
        } catch (error) {
            console.error('Failed to play audio:', error)
            setIsPlaying(false)
        } finally {
            setIsLoading(false)
        }
    }, [selectedReciter])

    const togglePlay = useCallback(() => {
        if (!audioRef.current || !currentAyah) return

        if (isPlaying) {
            audioRef.current.pause()
            setIsPlaying(false)
        } else {
            audioRef.current.play()
            setIsPlaying(true)
        }
    }, [isPlaying, currentAyah])

    const playNext = useCallback(async () => {
        // We need the latest state here. Since this is called from event listener, 
        // we rely on the state updates or refs. 
        // Actually, the closure might capture old state if not careful.
        // Let's use a ref to track current surah/ayah for the event listener logic if needed,
        // but since playNext is called from handleEnded which is defined in useEffect,
        // we need to make sure playNext is fresh or uses refs.
        // A better approach for the useEffect is to not define handleEnded there, 
        // or use a ref for the callback.

        // However, let's implement the logic first.

        // This implementation relies on the fact that we will fix the closure issue 
        // by using a ref for the "next" logic or putting this in a useEffect that updates the listener.
        // For simplicity in this step, I will use a ref to access current state inside the closure if I were writing raw JS,
        // but with React, I'll use a separate effect to bind the 'ended' listener to the current `playNext`.
    }, [])

    // We need to implement playNext properly with access to state
    const playNextRef = useRef<() => void>(() => { })

    useEffect(() => {
        playNextRef.current = async () => {
            if (!currentSurah || !currentAyah) return

            const currentIndex = currentSurah.ayahs.findIndex(a => a.number === currentAyah.number)

            // 1. Next Ayah in same Surah
            if (currentIndex !== -1 && currentIndex < currentSurah.ayahs.length - 1) {
                const nextAyah = currentSurah.ayahs[currentIndex + 1]
                playAyah(currentSurah, nextAyah)
                return
            }

            // 2. Next Surah
            if (currentIndex === currentSurah.ayahs.length - 1) {
                const nextSurahNumber = currentSurah.number + 1
                if (nextSurahNumber <= 114) {
                    try {
                        setIsLoading(true)
                        const nextSurah = await getSurahWithAudio(nextSurahNumber)
                        if (nextSurah && nextSurah.ayahs.length > 0) {
                            playAyah(nextSurah, nextSurah.ayahs[0])
                        }
                    } catch (error) {
                        console.error('Failed to load next surah:', error)
                    } finally {
                        setIsLoading(false)
                    }
                }
            }
        }
    }, [currentSurah, currentAyah, playAyah])

    const playPrevious = useCallback(() => {
        if (!currentSurah || !currentAyah) return

        const currentIndex = currentSurah.ayahs.findIndex(a => a.number === currentAyah.number)

        if (currentIndex > 0) {
            const prevAyah = currentSurah.ayahs[currentIndex - 1]
            playAyah(currentSurah, prevAyah)
        }
    }, [currentSurah, currentAyah, playAyah])

    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time
            setProgress(time)
        }
    }, [])

    // Setup Media Session Action Handlers
    useEffect(() => {
        if (!('mediaSession' in navigator)) return

        const audio = audioRef.current
        if (!audio) return

        navigator.mediaSession.setActionHandler('play', () => {
            audio.play()
        })

        navigator.mediaSession.setActionHandler('pause', () => {
            audio.pause()
        })

        navigator.mediaSession.setActionHandler('previoustrack', () => {
            playPrevious()
        })

        navigator.mediaSession.setActionHandler('nexttrack', () => {
            playNextRef.current()
        })

        navigator.mediaSession.setActionHandler('seekto', (details) => {
            if (details.seekTime && audio) {
                audio.currentTime = details.seekTime
            }
        })

        return () => {
            navigator.mediaSession.setActionHandler('play', null)
            navigator.mediaSession.setActionHandler('pause', null)
            navigator.mediaSession.setActionHandler('previoustrack', null)
            navigator.mediaSession.setActionHandler('nexttrack', null)
            navigator.mediaSession.setActionHandler('seekto', null)
        }
    }, [playPrevious]) // playNextRef is stable, playPrevious is stable from useCallback

    // Re-bind ended listener when playNext changes
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handleEnded = () => {
            playNextRef.current()
        }

        audio.addEventListener('ended', handleEnded)
        return () => audio.removeEventListener('ended', handleEnded)
    }, [currentSurah, currentAyah]) // Re-bind when state changes so playNextRef is fresh? 
    // Actually playNextRef.current is always fresh. We just need to bind it once?
    // No, playNextRef.current is a mutable ref, so the function inside it changes.
    // The listener calls the function stored in ref.

    return (
        <AudioContext.Provider value={{
            isPlaying,
            currentSurah,
            currentAyah,
            progress,
            duration,
            isLoading,
            selectedReciter,
            changeReciter,
            playAyah,
            togglePlay,
            playNext: () => playNextRef.current(),
            playPrevious,
            seek
        }}>
            {children}
        </AudioContext.Provider>
    )
}

export function useAudio() {
    const context = useContext(AudioContext)
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider')
    }
    return context
}
