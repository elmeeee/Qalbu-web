'use client'

import { useState, useEffect, useRef, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Heart, Share2, BookOpen, Loader2, MoreVertical, X, Search } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useAudio } from '@/contexts/audio-context'
import { useSearchParams } from 'next/navigation'
import { ReciterSelector } from '@/components/audio/reciter-selector'
import { Switch } from '@/components/ui/switch'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import html2canvas from 'html2canvas'
import { parseTajweed, TAJWEED_META, type TajweedMeta } from '@/lib/tajweed'
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso'

interface Ayah {
    number: number
    text: string
    translation?: string
    transliteration?: string
    numberInSurah: number
    audio: string
    tajweed?: string
    surah?: {
        number: number
        name: string
        englishName: string
        englishNameTranslation: string
        revelationType: string
    }
}

// List of all 114 Surahs
export const SURAHS = [
    { number: 1, name: 'Al-Fatihah', translation: 'The Opening', verses: 7, revelation: 'Mecca' },
    { number: 2, name: 'Al-Baqarah', translation: 'The Cow', verses: 286, revelation: 'Medina' },
    { number: 3, name: 'Ali \'Imran', translation: 'Family of Imran', verses: 200, revelation: 'Medina' },
    { number: 4, name: 'An-Nisa', translation: 'The Women', verses: 176, revelation: 'Medina' },
    { number: 5, name: 'Al-Ma\'idah', translation: 'The Table Spread', verses: 120, revelation: 'Medina' },
    { number: 6, name: 'Al-An\'am', translation: 'The Cattle', verses: 165, revelation: 'Mecca' },
    { number: 7, name: 'Al-A\'raf', translation: 'The Heights', verses: 206, revelation: 'Mecca' },
    { number: 8, name: 'Al-Anfal', translation: 'The Spoils of War', verses: 75, revelation: 'Medina' },
    { number: 9, name: 'At-Tawbah', translation: 'The Repentance', verses: 129, revelation: 'Medina' },
    { number: 10, name: 'Yunus', translation: 'Jonah', verses: 109, revelation: 'Mecca' },
    { number: 11, name: 'Hud', translation: 'Hud', verses: 123, revelation: 'Mecca' },
    { number: 12, name: 'Yusuf', translation: 'Joseph', verses: 111, revelation: 'Mecca' },
    { number: 13, name: 'Ar-Ra\'d', translation: 'The Thunder', verses: 43, revelation: 'Medina' },
    { number: 14, name: 'Ibrahim', translation: 'Abraham', verses: 52, revelation: 'Mecca' },
    { number: 15, name: 'Al-Hijr', translation: 'The Rocky Tract', verses: 99, revelation: 'Mecca' },
    { number: 16, name: 'An-Nahl', translation: 'The Bee', verses: 128, revelation: 'Mecca' },
    { number: 17, name: 'Al-Isra', translation: 'The Night Journey', verses: 111, revelation: 'Mecca' },
    { number: 18, name: 'Al-Kahf', translation: 'The Cave', verses: 110, revelation: 'Mecca' },
    { number: 19, name: 'Maryam', translation: 'Mary', verses: 98, revelation: 'Mecca' },
    { number: 20, name: 'Ta-Ha', translation: 'Ta-Ha', verses: 135, revelation: 'Mecca' },
    { number: 21, name: 'Al-Anbiya', translation: 'The Prophets', verses: 112, revelation: 'Mecca' },
    { number: 22, name: 'Al-Hajj', translation: 'The Pilgrimage', verses: 78, revelation: 'Medina' },
    { number: 23, name: 'Al-Mu\'minun', translation: 'The Believers', verses: 118, revelation: 'Mecca' },
    { number: 24, name: 'An-Nur', translation: 'The Light', verses: 64, revelation: 'Medina' },
    { number: 25, name: 'Al-Furqan', translation: 'The Criterion', verses: 77, revelation: 'Mecca' },
    { number: 26, name: 'Ash-Shu\'ara', translation: 'The Poets', verses: 227, revelation: 'Mecca' },
    { number: 27, name: 'An-Naml', translation: 'The Ant', verses: 93, revelation: 'Mecca' },
    { number: 28, name: 'Al-Qasas', translation: 'The Stories', verses: 88, revelation: 'Mecca' },
    { number: 29, name: 'Al-Ankabut', translation: 'The Spider', verses: 69, revelation: 'Mecca' },
    { number: 30, name: 'Ar-Rum', translation: 'The Romans', verses: 60, revelation: 'Mecca' },
    { number: 31, name: 'Luqman', translation: 'Luqman', verses: 34, revelation: 'Mecca' },
    { number: 32, name: 'As-Sajdah', translation: 'The Prostration', verses: 30, revelation: 'Mecca' },
    { number: 33, name: 'Al-Ahzab', translation: 'The Combined Forces', verses: 73, revelation: 'Medina' },
    { number: 34, name: 'Saba', translation: 'Sheba', verses: 54, revelation: 'Mecca' },
    { number: 35, name: 'Fatir', translation: 'Originator', verses: 45, revelation: 'Mecca' },
    { number: 36, name: 'Ya-Sin', translation: 'Ya Sin', verses: 83, revelation: 'Mecca' },
    { number: 37, name: 'As-Saffat', translation: 'Those Who Set The Ranks', verses: 182, revelation: 'Mecca' },
    { number: 38, name: 'Sad', translation: 'The Letter "Saad"', verses: 88, revelation: 'Mecca' },
    { number: 39, name: 'Az-Zumar', translation: 'The Troops', verses: 75, revelation: 'Mecca' },
    { number: 40, name: 'Ghafir', translation: 'The Forgiver', verses: 85, revelation: 'Mecca' },
    { number: 41, name: 'Fussilat', translation: 'Explained in Detail', verses: 54, revelation: 'Mecca' },
    { number: 42, name: 'Ash-Shura', translation: 'The Consultation', verses: 53, revelation: 'Mecca' },
    { number: 43, name: 'Az-Zukhruf', translation: 'The Ornaments of Gold', verses: 89, revelation: 'Mecca' },
    { number: 44, name: 'Ad-Dukhan', translation: 'The Smoke', verses: 59, revelation: 'Mecca' },
    { number: 45, name: 'Al-Jathiyah', translation: 'The Crouching', verses: 37, revelation: 'Mecca' },
    { number: 46, name: 'Al-Ahqaf', translation: 'The Wind-Curved Sandhills', verses: 35, revelation: 'Mecca' },
    { number: 47, name: 'Muhammad', translation: 'Muhammad', verses: 38, revelation: 'Medina' },
    { number: 48, name: 'Al-Fath', translation: 'The Victory', verses: 29, revelation: 'Medina' },
    { number: 49, name: 'Al-Hujurat', translation: 'The Rooms', verses: 18, revelation: 'Medina' },
    { number: 50, name: 'Qaf', translation: 'The Letter "Qaf"', verses: 45, revelation: 'Mecca' },
    { number: 51, name: 'Ad-Dhariyat', translation: 'The Winnowing Winds', verses: 60, revelation: 'Mecca' },
    { number: 52, name: 'At-Tur', translation: 'The Mount', verses: 49, revelation: 'Mecca' },
    { number: 53, name: 'An-Najm', translation: 'The Star', verses: 62, revelation: 'Mecca' },
    { number: 54, name: 'Al-Qamar', translation: 'The Moon', verses: 55, revelation: 'Mecca' },
    { number: 55, name: 'Ar-Rahman', translation: 'The Beneficent', verses: 78, revelation: 'Medina' },
    { number: 56, name: 'Al-Waqi\'ah', translation: 'The Inevitable', verses: 96, revelation: 'Mecca' },
    { number: 57, name: 'Al-Hadid', translation: 'The Iron', verses: 29, revelation: 'Medina' },
    { number: 58, name: 'Al-Mujadila', translation: 'The Pleading Woman', verses: 22, revelation: 'Medina' },
    { number: 59, name: 'Al-Hashr', translation: 'The Exile', verses: 24, revelation: 'Medina' },
    { number: 60, name: 'Al-Mumtahanah', translation: 'She That Is To Be Examined', verses: 13, revelation: 'Medina' },
    { number: 61, name: 'As-Saff', translation: 'The Ranks', verses: 14, revelation: 'Medina' },
    { number: 62, name: 'Al-Jumu\'ah', translation: 'The Congregation, Friday', verses: 11, revelation: 'Medina' },
    { number: 63, name: 'Al-Munafiqun', translation: 'The Hypocrites', verses: 11, revelation: 'Medina' },
    { number: 64, name: 'At-Taghabun', translation: 'The Mutual Disillusion', verses: 18, revelation: 'Medina' },
    { number: 65, name: 'At-Talaq', translation: 'The Divorce', verses: 12, revelation: 'Medina' },
    { number: 66, name: 'At-Tahrim', translation: 'The Prohibition', verses: 12, revelation: 'Medina' },
    { number: 67, name: 'Al-Mulk', translation: 'The Sovereignty', verses: 30, revelation: 'Mecca' },
    { number: 68, name: 'Al-Qalam', translation: 'The Pen', verses: 52, revelation: 'Mecca' },
    { number: 69, name: 'Al-Haqqah', translation: 'The Reality', verses: 52, revelation: 'Mecca' },
    { number: 70, name: 'Al-Ma\'arij', translation: 'The Ascending Stairways', verses: 44, revelation: 'Mecca' },
    { number: 71, name: 'Nuh', translation: 'Noah', verses: 28, revelation: 'Mecca' },
    { number: 72, name: 'Al-Jinn', translation: 'The Jinn', verses: 28, revelation: 'Mecca' },
    { number: 73, name: 'Al-Muzzammil', translation: 'The Enshrouded One', verses: 20, revelation: 'Mecca' },
    { number: 74, name: 'Al-Muddaththir', translation: 'The Cloaked One', verses: 56, revelation: 'Mecca' },
    { number: 75, name: 'Al-Qiyamah', translation: 'The Resurrection', verses: 40, revelation: 'Mecca' },
    { number: 76, name: 'Al-Insan', translation: 'The Man', verses: 31, revelation: 'Medina' },
    { number: 77, name: 'Al-Mursalat', translation: 'The Emissaries', verses: 50, revelation: 'Mecca' },
    { number: 78, name: 'An-Naba', translation: 'The Tidings', verses: 40, revelation: 'Mecca' },
    { number: 79, name: 'An-Nazi\'at', translation: 'Those Who Drag Forth', verses: 46, revelation: 'Mecca' },
    { number: 80, name: 'Abasa', translation: 'He Frowned', verses: 42, revelation: 'Mecca' },
    { number: 81, name: 'At-Takwir', translation: 'The Overthrowing', verses: 29, revelation: 'Mecca' },
    { number: 82, name: 'Al-Infitar', translation: 'The Cleaving', verses: 19, revelation: 'Mecca' },
    { number: 83, name: 'Al-Mutaffifin', translation: 'The Defrauding', verses: 36, revelation: 'Mecca' },
    { number: 84, name: 'Al-Inshiqaq', translation: 'The Sundering', verses: 25, revelation: 'Mecca' },
    { number: 85, name: 'Al-Buruj', translation: 'The Mansions of the Stars', verses: 22, revelation: 'Mecca' },
    { number: 86, name: 'At-Tariq', translation: 'The Morning Star', verses: 17, revelation: 'Mecca' },
    { number: 87, name: 'Al-A\'la', translation: 'The Most High', verses: 19, revelation: 'Mecca' },
    { number: 88, name: 'Al-Ghashiyah', translation: 'The Overwhelming', verses: 26, revelation: 'Mecca' },
    { number: 89, name: 'Al-Fajr', translation: 'The Dawn', verses: 30, revelation: 'Mecca' },
    { number: 90, name: 'Al-Balad', translation: 'The City', verses: 20, revelation: 'Mecca' },
    { number: 91, name: 'Ash-Shams', translation: 'The Sun', verses: 15, revelation: 'Mecca' },
    { number: 92, name: 'Al-Layl', translation: 'The Night', verses: 21, revelation: 'Mecca' },
    { number: 93, name: 'Ad-Duhaa', translation: 'The Morning Hours', verses: 11, revelation: 'Mecca' },
    { number: 94, name: 'Ash-Sharh', translation: 'The Relief', verses: 8, revelation: 'Mecca' },
    { number: 95, name: 'At-Tin', translation: 'The Fig', verses: 8, revelation: 'Mecca' },
    { number: 96, name: 'Al-Alaq', translation: 'The Clot', verses: 19, revelation: 'Mecca' },
    { number: 97, name: 'Al-Qadr', translation: 'The Power', verses: 5, revelation: 'Mecca' },
    { number: 98, name: 'Al-Bayyinah', translation: 'The Clear Proof', verses: 8, revelation: 'Medina' },
    { number: 99, name: 'Az-Zalzalah', translation: 'The Earthquake', verses: 8, revelation: 'Medina' },
    { number: 100, name: 'Al-Adiyat', translation: 'The Courser', verses: 11, revelation: 'Mecca' },
    { number: 101, name: 'Al-Qari\'ah', translation: 'The Calamity', verses: 11, revelation: 'Mecca' },
    { number: 102, name: 'At-Takathur', translation: 'The Rivalry in World Increase', verses: 8, revelation: 'Mecca' },
    { number: 103, name: 'Al-Asr', translation: 'The Declining Day', verses: 3, revelation: 'Mecca' },
    { number: 104, name: 'Al-Humazah', translation: 'The Traducer', verses: 9, revelation: 'Mecca' },
    { number: 105, name: 'Al-Fil', translation: 'The Elephant', verses: 5, revelation: 'Mecca' },
    { number: 106, name: 'Quraysh', translation: 'Quraysh', verses: 4, revelation: 'Mecca' },
    { number: 107, name: 'Al-Ma\'un', translation: 'The Small Kindnesses', verses: 7, revelation: 'Mecca' },
    { number: 108, name: 'Al-Kawthar', translation: 'The Abundance', verses: 3, revelation: 'Mecca' },
    { number: 109, name: 'Al-Kafirun', translation: 'The Disbelievers', verses: 6, revelation: 'Mecca' },
    { number: 110, name: 'An-Nasr', translation: 'The Divine Support', verses: 3, revelation: 'Medina' },
    { number: 111, name: 'Al-Masad', translation: 'The Palm Fiber', verses: 5, revelation: 'Mecca' },
    { number: 112, name: 'Al-Ikhlas', translation: 'The Sincerity', verses: 4, revelation: 'Mecca' },
    { number: 113, name: 'Al-Falaq', translation: 'The Daybreak', verses: 5, revelation: 'Mecca' },
    { number: 114, name: 'An-Nas', translation: 'Mankind', verses: 6, revelation: 'Mecca' },
]

const Scroller = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
    <div
        {...props}
        ref={ref}
        className="snap-y snap-mandatory scrollbar-hide h-full overflow-y-scroll"
        style={{ ...props.style, scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    />
))
Scroller.displayName = 'Scroller'

export function QuranReels() {
    const { t, language } = useLanguage()
    const { isMuted: contextMuted, setIsMuted: setContextMuted } = useAudio()
    const searchParams = useSearchParams()
    const virtuosoRef = useRef<VirtuosoHandle>(null)

    // State
    const [isLoading, setIsLoading] = useState(false)
    const [ayahs, setAyahs] = useState<Ayah[]>([])
    const [currentSurah, setCurrentSurah] = useState(1)
    const [currentAyah, setCurrentAyah] = useState(1)
    const [currentIndex, setCurrentIndex] = useState(0)

    // UI State
    const [showOverlayIcon, setShowOverlayIcon] = useState<'play' | 'pause' | null>(null)
    const [likedAyahs, setLikedAyahs] = useState<Set<string>>(new Set())
    const [showSurahSelector, setShowSurahSelector] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isPlaying, setIsPlaying] = useState(false)
    const [selectedTajweed, setSelectedTajweed] = useState<TajweedMeta | null>(null)
    const [showEndSurahAlert, setShowEndSurahAlert] = useState(false)

    // Settings State
    const [fontSize, setFontSize] = useState(2.5)
    const [showTranslation, setShowTranslation] = useState(true)
    const [showTransliteration, setShowTransliteration] = useState(true)
    const [autoPlay, setAutoPlay] = useState(true)
    const [selectedReciter, setSelectedReciter] = useState('ar.alafasy')

    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isMuted, setIsMuted] = useState(false)

    // Sync with global audio context (initially)
    useEffect(() => {
        setIsMuted(contextMuted)
    }, [])

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted
            setIsMuted(!isMuted)
            // Optional: dont sync back to global to allow independent volume
            // setContextMuted(!isMuted)
        }
    }

    // Initialize audio element
    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio()
            audioRef.current.preload = 'auto'
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [])

    // Load initial data
    const loadAyahs = async (surahCheck: number, ayahStart: number, reset: boolean = false) => {
        if (isLoading) return
        setIsLoading(true)

        try {
            // Fetch batch of ayahs (e.g. 10 at a time)
            const response = await fetch(`/api/quran/ayahs?surah=${surahCheck}&start=${ayahStart}&limit=10&reciter=${selectedReciter}`)
            const data = await response.json()

            if (data.ayahs && data.ayahs.length > 0) {
                if (reset) {
                    setAyahs(data.ayahs)
                } else {
                    setAyahs(prev => [...prev, ...data.ayahs])
                }

                // Update pointers for next fetch
                const lastAyah = data.ayahs[data.ayahs.length - 1]
                const lastSurahInfo = SURAHS.find(s => s.number === lastAyah.surah.number)

                if (lastSurahInfo) {
                    if (lastAyah.numberInSurah < lastSurahInfo.verses) {
                        setCurrentAyah(lastAyah.numberInSurah + 1)
                        setCurrentSurah(lastAyah.surah.number)
                    } else if (lastAyah.surah.number < 114) {
                        setCurrentAyah(1)
                        setCurrentSurah(lastAyah.surah.number + 1)
                    }
                }
            }
        } catch (error) {
            console.error('Error loading ayahs:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const surahParam = searchParams.get('surah')
        const ayahParam = searchParams.get('ayah')

        if (surahParam) {
            const surahNum = parseInt(surahParam)
            const ayahNum = ayahParam ? parseInt(ayahParam) : 1
            setCurrentSurah(surahNum)
            setCurrentAyah(ayahNum)
            loadAyahs(surahNum, ayahNum, true)
        } else {
            loadAyahs(1, 1, true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedReciter])

    // Auto-play audio when ayah changes
    useEffect(() => {
        if (ayahs[currentIndex] && audioRef.current) {
            const audio = audioRef.current
            const currentAudioSrc = ayahs[currentIndex].audio

            // Check if source changed to avoid restarting on data fetch
            if (audio.src !== currentAudioSrc) {
                // IMPORTANT: Completely stop and reset previous audio
                audio.pause()
                audio.currentTime = 0
                // Remove all previous event listeners to prevent multiple triggers
                audio.onended = null
                audio.oncanplaythrough = null

                // Set new source
                audio.src = currentAudioSrc
                audio.load()

                console.log(`🎵 Loading audio for ayah ${ayahs[currentIndex].numberInSurah}`)
            }

            // Only auto-play if enabled
            if (autoPlay) {
                // Update ended listener even if src didn't change (closure capture)
                const handleAudioEnd = () => {
                    console.log(`✅ Audio ended for ayah ${ayahs[currentIndex].numberInSurah}`)
                    const currentAyahData = ayahs[currentIndex]
                    const currentSurahData = SURAHS.find(s => s.number === currentAyahData.surah?.number)

                    // Check if this is the last ayah of the surah
                    if (currentSurahData && currentAyahData.numberInSurah === currentSurahData.verses) {
                        setIsPlaying(false)
                        setShowEndSurahAlert(true)
                        return
                    }

                    // Move to next ayah - this will trigger currentIndex change via onScroll
                    if (currentIndex < ayahs.length - 1) {
                        console.log(`⏭️  Moving to next ayah: ${currentIndex + 1}`)
                        virtuosoRef.current?.scrollToIndex({
                            index: currentIndex + 1,
                            align: 'start',
                            behavior: 'smooth'
                        })
                    }
                }

                const handleCanPlay = () => {
                    if (!isMuted) {
                        console.log(`▶️  Playing audio for ayah ${ayahs[currentIndex].numberInSurah}`)
                        // Ensure we are playing the right thing
                        if (audio.src === currentAudioSrc) {
                            audio.play().catch(err => {
                                if (err.name !== 'AbortError') {
                                    console.error('Audio play error:', err)
                                }
                            })
                            setIsPlaying(true)
                        }
                    } else {
                        setIsPlaying(false)
                    }
                }

                // Always re-attach ended to capture latest closures (like ayahs/currentIndex)
                // Note: using 'once' or removing manually is tricky if we want to update it.
                // Best to remove old and add new.
                // However, since we are inside useEffect with [currentIndex], 
                // every time index changes, we get here. 
                // BUT, if 'ayahs' changed (fetch more), we also get here.

                // If src didn't change, we might not want to interrupt playback unless we need to update 'ended'.
                // 'ended' needs 'ayahs' and 'currentIndex'.
                // If 'ayahs' changed, we definitely need to update 'ended' listener because 'ayahs' closure changed?
                // Yes.

                // Clean up previous listeners if we are essentially re-running the effect on same ayah
                const onEndedWrapper = () => handleAudioEnd()
                audio.addEventListener('ended', onEndedWrapper)

                // If it's a new load (src changed), wait for canplay
                if (audio.src !== currentAudioSrc || audio.paused) {
                    if (audio.readyState >= 3) {
                        handleCanPlay()
                    } else {
                        audio.addEventListener('canplaythrough', handleCanPlay, { once: true })
                    }
                } else if (isPlaying && !audio.paused) {
                    // Already playing correct src, ensure state reflects it
                    setIsPlaying(true)
                }

                return () => {
                    audio.removeEventListener('ended', onEndedWrapper)
                    audio.removeEventListener('canplaythrough', handleCanPlay)
                }
            } else {
                setIsPlaying(false)
                audio.pause()
            }
        }

        // Cleanup function for when component unmounts or severe change
        return () => {
            // We generally don't want to stop audio just because effect re-ran if src is same
            // But if we navigate away (component unmount), we should.
            // Rely on parent useEffect cleanup? 
            // Actually, if we change currentIndex, we DO want to pause old track (handled by src check logic above technically)
        }
    }, [currentIndex, ayahs, isMuted, autoPlay])

    const handleTap = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
            setIsPlaying(false)
            setShowOverlayIcon('pause')
        } else {
            audioRef.current.play()
            setIsPlaying(true)
            setShowOverlayIcon('play')
        }

        setTimeout(() => setShowOverlayIcon(null), 1000)
    }

    const toggleLike = () => {
        const currentAyahData = ayahs[currentIndex]
        if (!currentAyahData) return

        const id = `${currentAyahData.surah?.number}-${currentAyahData.numberInSurah}`
        const newLiked = new Set(likedAyahs)
        if (newLiked.has(id)) {
            newLiked.delete(id)
        } else {
            newLiked.add(id)
        }
        setLikedAyahs(newLiked)
    }

    const handleShare = async () => {
        const currentAyahData = ayahs[currentIndex]
        if (!currentAyahData) return

        // Simple share
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Quran - ${currentAyahData.surah?.englishName} ${currentAyahData.numberInSurah}`,
                    text: `${currentAyahData.text}\n\n${currentAyahData.translation}`,
                    url: window.location.href,
                })
            } catch (err) {
                console.log('Share error:', err)
            }
        }
    }

    const handleChangeSurah = (surahNumber: number) => {
        setCurrentSurah(surahNumber)
        setCurrentAyah(1)
        setAyahs([]) // Clear current list
        setCurrentIndex(0)
        loadAyahs(surahNumber, 1, true)
        setShowSurahSelector(false)
    }

    const handleNextSurah = () => {
        // Use the current ayah's surah number to determine the next one
        const currentDisplayedSurah = ayahs[currentIndex]?.surah?.number || currentSurah
        const nextSurahNum = currentDisplayedSurah + 1

        if (nextSurahNum <= 114) {
            handleChangeSurah(nextSurahNum)
            setShowEndSurahAlert(false)
        }
    }

    const filteredSurahs = SURAHS.filter(surah =>
        surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.number.toString().includes(searchQuery)
    )

    const renderAyah = (index: number, ayah: Ayah) => {
        return (
            <div className="h-[100vh] w-full snap-center relative flex items-center justify-center bg-slate-50 dark:bg-black hardware-accelerated transition-colors duration-500">
                {/* Dynamic Gradient Background matching Home */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 dark:from-slate-950 dark:via-black dark:to-slate-950" />

                {/* Animated Pattern Overlay - Simplified for performance */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.2),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
                </div>

                <div onClick={handleTap} className="absolute inset-0 z-10 cursor-pointer" />

                {/* Play/Pause Overlay Icon */}
                <AnimatePresence>
                    {showOverlayIcon && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.5, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-black/40 backdrop-blur-md p-6 rounded-full"
                            >
                                {showOverlayIcon === 'play' ? (
                                    <Play className="h-12 w-12 text-white fill-white" />
                                ) : (
                                    <Pause className="h-12 w-12 text-white fill-white" />
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Top Header - Controls */}
                <div className="absolute top-0 left-0 right-0 z-30 p-6 pt-12 pointer-events-none flex justify-between items-start">
                    <div className="pointer-events-auto" onClick={() => setShowSurahSelector(true)}>
                        <div className="flex items-center gap-2 bg-white/80 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/50 dark:border-white/10 shadow-sm">
                            <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-slate-700 dark:text-white font-medium">{ayah.surah?.englishName}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{ayah.numberInSurah}</span>
                        </div>
                    </div>

                    <div className="pointer-events-auto flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-2 rounded-full bg-white/80 dark:bg-black/20 backdrop-blur-md border border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-white shadow-sm">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 bg-slate-900/95 backdrop-blur-xl border-white/10">
                                <DropdownMenuLabel className="text-emerald-500">Settings</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />

                                <div className="p-2 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">Translation</span>
                                        <Switch checked={showTranslation} onCheckedChange={setShowTranslation} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">Transliteration</span>
                                        <Switch checked={showTransliteration} onCheckedChange={setShowTransliteration} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">Auto Play</span>
                                        <Switch checked={autoPlay} onCheckedChange={setAutoPlay} />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-sm text-gray-300">Font Size</span>
                                        <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1">
                                            <button onClick={() => setFontSize(Math.max(2, fontSize - 0.5))} className="flex-1 p-1 text-white hover:bg-white/10 rounded">-</button>
                                            <span className="text-xs text-emerald-400">{fontSize}x</span>
                                            <button onClick={() => setFontSize(Math.min(6, fontSize + 0.5))} className="flex-1 p-1 text-white hover:bg-white/10 rounded">+</button>
                                        </div>
                                    </div>
                                </div>

                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuLabel className="text-emerald-500">Reciter</DropdownMenuLabel>
                                <div className="p-2">
                                    <ReciterSelector />
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full px-6 flex flex-col items-center gap-8 z-10">
                    {/* Arabic */}
                    <div
                        className="text-slate-900 dark:text-white text-center leading-relaxed drop-shadow-sm dark:drop-shadow-lg transition-colors duration-500"
                        dir="rtl"
                        style={{
                            fontSize: `${fontSize}rem`,
                            fontFamily: "'Scheherazade New', serif"
                        }}
                    >
                        {ayah.tajweed ? parseTajweed(ayah.tajweed, (meta) => setSelectedTajweed(meta), language) : ayah.text}
                    </div>

                    {/* Translateration */}
                    {showTransliteration && ayah.transliteration && (
                        <div className="text-emerald-700 dark:text-emerald-200/80 text-lg text-center font-medium italic max-w-2xl transition-colors duration-500">
                            {ayah.transliteration}
                        </div>
                    )}

                    {/* Translation */}
                    {showTranslation && ayah.translation && (
                        <div className="text-slate-700 dark:text-white/90 text-lg text-center leading-relaxed max-w-2xl font-light transition-colors duration-500">
                            {ayah.translation}
                        </div>
                    )}
                </div>

                {/* Bottom Actions - Like/Share/Mute */}
                <div className="absolute bottom-32 right-6 z-30 flex flex-col gap-3 pointer-events-auto">
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleLike() }}
                        className={`p-3 rounded-full backdrop-blur-md border transition-all shadow-sm ${likedAyahs.has(`${ayah.surah?.number}-${ayah.numberInSurah}`)
                            ? 'bg-rose-500/10 border-rose-500/50 text-rose-500'
                            : 'bg-white/80 dark:bg-black/20 border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-white hover:bg-rose-500/10 hover:border-rose-500/30 dark:hover:bg-rose-500/20'
                            }`}
                    >
                        <Heart
                            className={`w-6 h-6 transition-all ${likedAyahs.has(`${ayah.surah?.number}-${ayah.numberInSurah}`) ? 'fill-rose-500 text-rose-500' : ''
                                }`}
                        />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleMute() }}
                        className="p-3 rounded-full bg-white/80 dark:bg-black/20 backdrop-blur-md border border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-white hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors shadow-sm"
                    >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleShare() }}
                        className="p-3 rounded-full bg-white/80 dark:bg-black/20 backdrop-blur-md border border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-white hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors shadow-sm"
                    >
                        <Share2 className="w-6 h-6" />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="relative h-screen w-full bg-slate-50 dark:bg-black overflow-hidden transition-colors duration-500">
            {/* Scrollable Container with Virtuoso */}
            <Virtuoso
                ref={virtuosoRef}
                style={{ height: '100vh', width: '100%' }}
                totalCount={ayahs.length}
                data={ayahs}
                itemContent={renderAyah}
                rangeChanged={({ startIndex }) => {
                    // Load more when near the end
                    if (startIndex >= ayahs.length - 3 && !isLoading) {
                        loadAyahs(currentSurah, currentAyah)
                    }
                }}
                onScroll={(e) => {
                    const target = e.target as HTMLElement
                    const height = target.clientHeight
                    if (height > 0) {
                        const newIndex = Math.round(target.scrollTop / height)
                        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < ayahs.length) {
                            setCurrentIndex(newIndex)
                        }
                    }
                }}
                components={{
                    Scroller: Scroller,
                    // Use standard divs for header/footer
                    Header: () => <div className="h-0" />,
                    Footer: () => <div className="h-0" />
                }}
            />

            {/* End of Surah Alert */}
            <AnimatePresence>
                {showEndSurahAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-10 left-6 right-6 z-50 p-6 bg-slate-900/95 backdrop-blur-md border border-emerald-500/30 rounded-2xl shadow-xl shadow-emerald-900/40"
                    >
                        <div className="flex flex-col gap-4 text-center">
                            <h3 className="text-xl font-bold text-white">End of Surah</h3>
                            <p className="text-slate-300">
                                You have completed Surah {ayahs[currentIndex]?.surah?.englishName}.
                                Continue to the next Surah?
                            </p>
                            <div className="flex gap-3 mt-2">
                                <button
                                    onClick={() => setShowEndSurahAlert(false)}
                                    className="flex-1 py-3 px-4 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition"
                                >
                                    Stay Here
                                </button>
                                <button
                                    onClick={handleNextSurah}
                                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20"
                                >
                                    Next Surah
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Surah Selector Overlay */}
            <AnimatePresence>
                {showSurahSelector && (
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col"
                    >
                        <div className="p-4 border-b border-white/10 flex items-center gap-4">
                            <button onClick={() => setShowSurahSelector(false)} className="p-2 hover:bg-white/10 rounded-full text-white">
                                <X className="w-6 h-6" />
                            </button>
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search Surah..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {filteredSurahs.map(surah => (
                                <button
                                    key={surah.number}
                                    onClick={() => handleChangeSurah(surah.number)}
                                    className="w-full text-left p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                            {surah.number}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{surah.name}</h3>
                                            <p className="text-sm text-gray-400">{surah.translation} • {surah.verses} Verses</p>
                                        </div>
                                    </div>
                                    <div className="text-emerald-500/50 group-hover:text-emerald-400">
                                        {surah.revelation}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
