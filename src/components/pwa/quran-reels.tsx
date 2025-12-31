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
    { number: 20, name: 'Taha', translation: 'Ta-Ha', verses: 135, revelation: 'Mecca' },
    { number: 21, name: 'Al-Anbya', translation: 'The Prophets', verses: 112, revelation: 'Mecca' },
    { number: 22, name: 'Al-Hajj', translation: 'The Pilgrimage', verses: 78, revelation: 'Medina' },
    { number: 23, name: 'Al-Mu\'minun', translation: 'The Believers', verses: 118, revelation: 'Mecca' },
    { number: 24, name: 'An-Nur', translation: 'The Light', verses: 64, revelation: 'Medina' },
    { number: 25, name: 'Al-Furqan', translation: 'The Criterion', verses: 77, revelation: 'Mecca' },
    { number: 26, name: 'Ash-Shu\'ara', translation: 'The Poets', verses: 227, revelation: 'Mecca' },
    { number: 27, name: 'An-Naml', translation: 'The Ant', verses: 93, revelation: 'Mecca' },
    { number: 28, name: 'Al-Qasas', translation: 'The Stories', verses: 88, revelation: 'Mecca' },
    { number: 29, name: 'Al-\'Ankabut', translation: 'The Spider', verses: 69, revelation: 'Mecca' },
    { number: 30, name: 'Ar-Rum', translation: 'The Romans', verses: 60, revelation: 'Mecca' },
    { number: 31, name: 'Luqman', translation: 'Luqman', verses: 34, revelation: 'Mecca' },
    { number: 32, name: 'As-Sajdah', translation: 'The Prostration', verses: 30, revelation: 'Mecca' },
    { number: 33, name: 'Al-Ahzab', translation: 'The Combined Forces', verses: 73, revelation: 'Medina' },
    { number: 34, name: 'Saba', translation: 'Sheba', verses: 54, revelation: 'Mecca' },
    { number: 35, name: 'Fatir', translation: 'Originator', verses: 45, revelation: 'Mecca' },
    { number: 36, name: 'Ya-Sin', translation: 'Ya Sin', verses: 83, revelation: 'Mecca' },
    { number: 37, name: 'As-Saffat', translation: 'Those who set the Ranks', verses: 182, revelation: 'Mecca' },
    { number: 38, name: 'Sad', translation: 'The Letter "Saad"', verses: 88, revelation: 'Mecca' },
    { number: 39, name: 'Az-Zumar', translation: 'The Troops', verses: 75, revelation: 'Mecca' },
    { number: 40, name: 'Ghafir', translation: 'The Forgiver', verses: 85, revelation: 'Mecca' },
    { number: 41, name: 'Fussilat', translation: 'Explained in Detail', verses: 54, revelation: 'Mecca' },
    { number: 42, name: 'Ash-Shuraa', translation: 'The Consultation', verses: 53, revelation: 'Mecca' },
    { number: 43, name: 'Az-Zukhruf', translation: 'The Ornaments of Gold', verses: 89, revelation: 'Mecca' },
    { number: 44, name: 'Ad-Dukhan', translation: 'The Smoke', verses: 59, revelation: 'Mecca' },
    { number: 45, name: 'Al-Jathiyah', translation: 'The Crouching', verses: 37, revelation: 'Mecca' },
    { number: 46, name: 'Al-Ahqaf', translation: 'The Wind-Curved Sandhills', verses: 35, revelation: 'Mecca' },
    { number: 47, name: 'Muhammad', translation: 'Muhammad', verses: 38, revelation: 'Medina' },
    { number: 48, name: 'Al-Fath', translation: 'The Victory', verses: 29, revelation: 'Medina' },
    { number: 49, name: 'Al-Hujurat', translation: 'The Rooms', verses: 18, revelation: 'Medina' },
    { number: 50, name: 'Qaf', translation: 'The Letter "Qaf"', verses: 45, revelation: 'Mecca' },
    { number: 51, name: 'Adh-Dhariyat', translation: 'The Winnowing Winds', verses: 60, revelation: 'Mecca' },
    { number: 52, name: 'At-Tur', translation: 'The Mount', verses: 49, revelation: 'Mecca' },
    { number: 53, name: 'An-Najm', translation: 'The Star', verses: 62, revelation: 'Mecca' },
    { number: 54, name: 'Al-Qamar', translation: 'The Moon', verses: 55, revelation: 'Mecca' },
    { number: 55, name: 'Ar-Rahman', translation: 'The Beneficent', verses: 78, revelation: 'Medina' },
    { number: 56, name: 'Al-Waqi\'ah', translation: 'The Inevitable', verses: 96, revelation: 'Mecca' },
    { number: 57, name: 'Al-Hadid', translation: 'The Iron', verses: 29, revelation: 'Medina' },
    { number: 58, name: 'Al-Mujadila', translation: 'The Pleading Woman', verses: 22, revelation: 'Medina' },
    { number: 59, name: 'Al-Hashr', translation: 'The Exile', verses: 24, revelation: 'Medina' },
    { number: 60, name: 'Al-Mumtahanah', translation: 'She that is to be examined', verses: 13, revelation: 'Medina' },
    { number: 61, name: 'As-Saf', translation: 'The Ranks', verses: 14, revelation: 'Medina' },
    { number: 62, name: 'Al-Jumu\'ah', translation: 'The Congregation', verses: 11, revelation: 'Medina' },
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
    { number: 79, name: 'An-Nazi\'at', translation: 'Those who drag forth', verses: 46, revelation: 'Mecca' },
    { number: 80, name: 'Abasa', translation: 'He Frowned', verses: 42, revelation: 'Mecca' },
    { number: 81, name: 'At-Takwir', translation: 'The Overthrowing', verses: 29, revelation: 'Mecca' },
    { number: 82, name: 'Al-Infitar', translation: 'The Cleaving', verses: 19, revelation: 'Mecca' },
    { number: 83, name: 'Al-Mutaffifin', translation: 'The Defrauding', verses: 36, revelation: 'Mecca' },
    { number: 84, name: 'Al-Inshiqaq', translation: 'The Sundering', verses: 25, revelation: 'Mecca' },
    { number: 85, name: 'Al-Buruj', translation: 'The Mansions of the Stars', verses: 22, revelation: 'Mecca' },
    { number: 86, name: 'At-Tariq', translation: 'The Nightcommer', verses: 17, revelation: 'Mecca' },
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
    { number: 102, name: 'At-Takathur', translation: 'The Rivalry in world increase', verses: 8, revelation: 'Mecca' },
    { number: 103, name: 'Al-Asr', translation: 'The Declining Day', verses: 3, revelation: 'Mecca' },
    { number: 104, name: 'Al-Humazah', translation: 'The Traducer', verses: 9, revelation: 'Mecca' },
    { number: 105, name: 'Al-Fil', translation: 'The Elephant', verses: 5, revelation: 'Mecca' },
    { number: 106, name: 'Quraysh', translation: 'Quraysh', verses: 4, revelation: 'Mecca' },
    { number: 107, name: 'Al-Ma\'un', translation: 'The Small kindnesses', verses: 7, revelation: 'Mecca' },
    { number: 108, name: 'Al-Kawthar', translation: 'The Abundance', verses: 3, revelation: 'Mecca' },
    { number: 109, name: 'Al-Kafirun', translation: 'The Disbelievers', verses: 6, revelation: 'Mecca' },
    { number: 110, name: 'An-Nasr', translation: 'The Divine Support', verses: 3, revelation: 'Medina' },
    { number: 111, name: 'Al-Masad', translation: 'The Palm Fiber', verses: 5, revelation: 'Mecca' },
    { number: 112, name: 'Al-Ikhlas', translation: 'The Sincerity', verses: 4, revelation: 'Mecca' },
    { number: 113, name: 'Al-Falaq', translation: 'The Daybreak', verses: 5, revelation: 'Mecca' },
    { number: 114, name: 'An-Nas', translation: 'Mankind', verses: 6, revelation: 'Mecca' },
]

export function QuranReels() {
    const { language } = useLanguage()
    const { selectedReciter } = useAudio()
    const [ayahs, setAyahs] = useState<Ayah[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [currentSurah, setCurrentSurah] = useState(1)
    const [currentAyah, setCurrentAyah] = useState(1)
    const [showTranslation, setShowTranslation] = useState(false)
    const [showTransliteration, setShowTransliteration] = useState(false)
    const [showSurahSelector, setShowSurahSelector] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [showOverlayIcon, setShowOverlayIcon] = useState<'play' | 'pause' | null>(null)
    const [showEndSurahAlert, setShowEndSurahAlert] = useState(false)
    const [selectedTajweed, setSelectedTajweed] = useState<TajweedMeta | null>(null)
    const [likedAyahs, setLikedAyahs] = useState<Set<string>>(new Set())

    // New User Settings
    const [fontSize, setFontSize] = useState(3) // Default 3rem (~text-5xl)
    const [autoPlay, setAutoPlay] = useState(true) // Default to auto-play audio
    const audioRef = useRef<HTMLAudioElement>(null)
    const virtuosoRef = useRef<VirtuosoHandle>(null)
    const shareCardRef = useRef<HTMLDivElement>(null)
    const searchParams = useSearchParams()

    // Persist Settings
    useEffect(() => {
        const savedSettings = localStorage.getItem('quran-reels-settings')
        if (savedSettings) {
            try {
                const { showTranslation, showTransliteration, fontSize, autoPlay } = JSON.parse(savedSettings)
                if (typeof showTranslation === 'boolean') setShowTranslation(showTranslation)
                if (typeof showTransliteration === 'boolean') setShowTransliteration(showTransliteration)
                if (typeof fontSize === 'number') setFontSize(fontSize)
                if (typeof autoPlay === 'boolean') setAutoPlay(autoPlay)
            } catch (e) {
                console.error('Failed to parse settings', e)
            }
        }
    }, [])

    // Load liked ayahs from localStorage
    useEffect(() => {
        const savedLikes = localStorage.getItem('liked-ayahs')
        if (savedLikes) {
            try {
                setLikedAyahs(new Set(JSON.parse(savedLikes)))
            } catch (e) {
                console.error('Failed to parse liked ayahs', e)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('quran-reels-settings', JSON.stringify({
            showTranslation,
            showTransliteration,
            fontSize,
            autoPlay
        }))
    }, [showTranslation, showTransliteration, fontSize, autoPlay])

    // Save Last Read
    useEffect(() => {
        if (ayahs[currentIndex]) {
            const currentAyahData = ayahs[currentIndex]
            if (currentAyahData.surah) {
                localStorage.setItem('quran-last-read', JSON.stringify({
                    surah: currentAyahData.surah.number,
                    ayah: currentAyahData.numberInSurah,
                    timestamp: Date.now()
                }))
            }
        }
    }, [currentIndex, ayahs])

    const handleShare = async () => {
        if (!shareCardRef.current || !ayahs[currentIndex]) return

        try {
            const canvas = await html2canvas(shareCardRef.current, {
                backgroundColor: null,
                scale: 2,
                logging: false,
            })

            canvas.toBlob(async (blob) => {
                if (!blob) return

                const file = new File([blob], 'qalbu-ayah.png', { type: 'image/png' })

                if (navigator.share && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: `Quran - ${ayahs[currentIndex].surah?.englishName}`,
                        text: `Ayah ${ayahs[currentIndex].numberInSurah}`,
                    })
                } else {
                    // Fallback: download the image
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'qalbu-ayah.png'
                    a.click()
                    URL.revokeObjectURL(url)
                }
            })
        } catch (error) {
            console.error('Error sharing:', error)
        }
    }

    const toggleLike = () => {
        const currentAyahData = ayahs[currentIndex]
        if (!currentAyahData) return

        const ayahKey = `${currentAyahData.surah?.number}-${currentAyahData.numberInSurah}`
        const newLikedAyahs = new Set(likedAyahs)

        if (newLikedAyahs.has(ayahKey)) {
            newLikedAyahs.delete(ayahKey)
        } else {
            newLikedAyahs.add(ayahKey)
        }

        setLikedAyahs(newLikedAyahs)
        localStorage.setItem('liked-ayahs', JSON.stringify(Array.from(newLikedAyahs)))
    }

    // Load initial ayahs
    useEffect(() => {
        // Check for resume params first
        const resumeSurah = searchParams.get('surah')
        const resumeAyah = searchParams.get('ayah')

        if (resumeSurah && resumeAyah) {
            const surahNum = parseInt(resumeSurah)
            const ayahNum = parseInt(resumeAyah)
            if (!isNaN(surahNum) && !isNaN(ayahNum)) {
                setCurrentSurah(surahNum)
                setCurrentAyah(ayahNum)
                loadAyahs(surahNum, ayahNum, true)
                return
            }
        }

        loadAyahs(currentSurah, currentAyah, true)
    }, [selectedReciter])

    // Auto-play audio when ayah changes
    useEffect(() => {
        if (ayahs[currentIndex] && audioRef.current) {
            const audio = audioRef.current

            // IMPORTANT: Completely stop and reset previous audio
            audio.pause()
            audio.currentTime = 0
            // Remove all previous event listeners to prevent multiple triggers
            audio.onended = null
            audio.oncanplaythrough = null

            // Set new source
            audio.src = ayahs[currentIndex].audio
            audio.load()

            console.log(`🎵 Loading audio for ayah ${ayahs[currentIndex].numberInSurah}`)

            // Only auto-play if enabled
            if (autoPlay) {
                // Auto-play and auto-scroll to next ayah when audio ends
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

                    // Move to next ayah - this will trigger currentIndex change via rangeChanged
                    if (currentIndex < ayahs.length - 1) {
                        console.log(`⏭️  Moving to next ayah: ${currentIndex + 1}`)
                        virtuosoRef.current?.scrollToIndex({
                            index: currentIndex + 1,
                            align: 'start',
                            behavior: 'smooth'
                        })
                        // The rangeChanged callback will update currentIndex,
                        // which will trigger this useEffect again with the new ayah
                    }
                }

                const handleCanPlay = () => {
                    if (!isMuted) {
                        console.log(`▶️  Playing audio for ayah ${ayahs[currentIndex].numberInSurah}`)
                        audio.play().catch(err => {
                            if (err.name !== 'AbortError') {
                                console.error('Audio play error:', err)
                            }
                        })
                        setIsPlaying(true)
                    } else {
                        setIsPlaying(false)
                    }
                }

                audio.addEventListener('ended', handleAudioEnd)

                // Check if already ready to play (e.g. from cache)
                if (audio.readyState >= 3) {
                    handleCanPlay()
                } else {
                    audio.addEventListener('canplaythrough', handleCanPlay, { once: true })
                }

                return () => {
                    // Cleanup: remove event listeners when component unmounts or dependencies change
                    audio.removeEventListener('ended', handleAudioEnd)
                    audio.removeEventListener('canplaythrough', handleCanPlay)
                }
            } else {
                setIsPlaying(false)
            }
        }

        // Cleanup function to stop audio when switching ayahs
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
            }
        }
    }, [currentIndex, ayahs, isMuted, autoPlay])

    const loadAyahs = async (surah: number, startAyah: number, reset: boolean = false) => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/quran/ayahs?surah=${surah}&startAyah=${startAyah}&count=10&edition=en.asad&audioEdition=${selectedReciter}`)
            const data = await response.json()

            if (reset) {
                setAyahs(data.ayahs)
            } else {
                // Prevent duplicates by checking if ayah already exists
                setAyahs(prev => {
                    const existingKeys = new Set(prev.map(a => `${a.surah?.number}-${a.numberInSurah}`))
                    const newAyahs = data.ayahs.filter((a: Ayah) => !existingKeys.has(`${a.surah?.number}-${a.numberInSurah}`))
                    return [...prev, ...newAyahs]
                })
            }
            setCurrentSurah(data.nextSurah)
            setCurrentAyah(data.nextAyah)
        } catch (error) {
            console.error('Error loading ayahs:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
                setShowOverlayIcon('pause')
            } else {
                audioRef.current.play().catch(console.error)
                setShowOverlayIcon('play')
            }
            setIsPlaying(!isPlaying)
            setTimeout(() => setShowOverlayIcon(null), 600)
        }
    }

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    const handleTap = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
                setShowOverlayIcon('pause')
            } else {
                audioRef.current.play().catch(console.error)
                setShowOverlayIcon('play')
            }
            setIsPlaying(!isPlaying)
            setTimeout(() => setShowOverlayIcon(null), 600)
        }
    }

    const handleChangeSurah = (surahNumber: number) => {
        // Reset everything and load new surah
        setAyahs([])
        setCurrentIndex(0)
        setCurrentSurah(surahNumber)
        setCurrentAyah(1)
        setShowSurahSelector(false)
        setSearchQuery('')
        // Pass reset=true to ensure we start fresh and avoid duplicates/ordering issues
        loadAyahs(surahNumber, 1, true)

        // Scroll to top
        virtuosoRef.current?.scrollToIndex({ index: 0 })
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
            <div className="h-[100vh] w-full snap-center relative flex items-center justify-center bg-black hardware-accelerated">
                {/* Dynamic Gradient Background */}
                <div className="absolute inset-0 bg-slate-950" />

                {/* Animated Pattern Overlay - Simplified for performance */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
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
                        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <BookOpen className="h-4 w-4 text-emerald-400" />
                            <span className="text-white font-medium">{ayah.surah?.englishName}</span>
                            <span className="text-emerald-400 font-bold">{ayah.numberInSurah}</span>
                        </div>
                    </div>

                    <div className="pointer-events-auto flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white">
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
                        className="text-white text-center leading-relaxed drop-shadow-lg"
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
                        <div className="text-emerald-200/80 text-lg text-center font-medium italic max-w-2xl">
                            {ayah.transliteration}
                        </div>
                    )}

                    {/* Translation */}
                    {showTranslation && ayah.translation && (
                        <div className="text-white/90 text-lg text-center leading-relaxed max-w-2xl font-light">
                            {ayah.translation}
                        </div>
                    )}
                </div>

                {/* Bottom Actions - Like/Share/Mute */}
                <div className="absolute bottom-32 right-6 z-30 flex flex-col gap-3 pointer-events-auto">
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleLike() }}
                        className={`p-3 rounded-full backdrop-blur-md border transition-all ${likedAyahs.has(`${ayah.surah?.number}-${ayah.numberInSurah}`)
                            ? 'bg-rose-500/30 border-rose-500/50 text-rose-400'
                            : 'bg-black/20 border-white/10 text-white hover:bg-rose-500/20 hover:border-rose-500/30'
                            }`}
                    >
                        <Heart
                            className={`w-6 h-6 transition-all ${likedAyahs.has(`${ayah.surah?.number}-${ayah.numberInSurah}`) ? 'fill-rose-400' : ''
                                }`}
                        />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleMute() }}
                        className="p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-emerald-500/20 transition-colors"
                    >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleShare() }}
                        className="p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-emerald-500/20 transition-colors"
                    >
                        <Share2 className="w-6 h-6" />
                    </button>
                </div>
            </div>
        )
    }

    if (isLoading && ayahs.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
            </div>
        )
    }

    return (
        <div className="relative h-screen overflow-hidden bg-black">
            <audio ref={audioRef} />

            {/* Hidden Share Card for Image Generation */}
            <div className="fixed -left-[9999px] top-0">
                {ayahs[currentIndex] && (
                    <div
                        ref={shareCardRef}
                        className="w-[1080px] h-[1920px] relative overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #0f172a 0%, #042f2e 50%, #064e3b 100%)'
                        }}
                    >
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-3xl -mr-48 -mt-48" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-3xl -ml-32 -mb-32" />

                        {/* Content Container */}
                        <div className="relative z-10 h-full flex flex-col p-16">
                            {/* Header - Logo & Branding */}
                            <div className="flex items-center gap-5 mb-12">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/icons/qalbuIcon.png"
                                    alt="Qalbu"
                                    className="w-24 h-24 rounded-2xl shadow-2xl"
                                />
                                <div>
                                    <h1 className="text-6xl font-bold text-white leading-tight">Qalbu</h1>
                                    <p className="text-2xl text-emerald-200/80 font-medium">Quran</p>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 flex flex-col items-center justify-center gap-16 overflow-hidden py-10">
                                {/* Surah Info Badge */}
                                <div className="text-center flex-shrink-0">
                                    <div className="inline-block bg-white/10 backdrop-blur-2xl px-12 py-5 rounded-full border border-white/20 shadow-2xl">
                                        <span className="text-4xl font-bold text-white tracking-wide">
                                            {ayahs[currentIndex].surah?.englishName} • {ayahs[currentIndex].numberInSurah}
                                        </span>
                                    </div>
                                </div>

                                {/* Arabic Text - Main Focus */}
                                <div className="w-full px-8 flex-shrink-0">
                                    <div
                                        className="text-[5.5rem] font-arabic text-white leading-[2.2] text-center drop-shadow-2xl"
                                        dir="rtl"
                                        style={{
                                            fontFamily: "'Scheherazade New', serif",
                                            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                        }}
                                    >
                                        {ayahs[currentIndex].tajweed ? parseTajweed(ayahs[currentIndex].tajweed) : ayahs[currentIndex].text}
                                    </div>
                                </div>

                                {/* Translation */}
                                {ayahs[currentIndex].translation && (
                                    <div className="max-w-4xl mx-auto flex-shrink-0">
                                        <p className="text-4xl text-emerald-50/90 text-center leading-relaxed font-light tracking-wide">
                                            &ldquo;{ayahs[currentIndex].translation}&rdquo;
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer - App Promotion */}
                            <div className="mt-auto text-center pt-10 border-t border-white/10 flex-shrink-0">
                                <p className="text-3xl font-bold text-white mb-3">
                                    Read & Listen on Qalbu App
                                </p>
                                <p className="text-2xl text-emerald-200/80 font-medium">
                                    Your Daily Islamic Companion 🤲
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Scrollable Container with Virtuoso */}
            <Virtuoso
                ref={virtuosoRef}
                style={{ height: '100vh', width: '100%' }}
                totalCount={ayahs.length}
                data={ayahs}
                itemContent={renderAyah}
                rangeChanged={({ startIndex }) => {
                    if (startIndex !== currentIndex) {
                        setCurrentIndex(startIndex)
                        // Load more when near the end
                        if (startIndex >= ayahs.length - 3 && !isLoading) {
                            loadAyahs(currentSurah, currentAyah)
                        }
                    }
                }}
                components={{
                    // eslint-disable-next-line react/display-name
                    Scroller: forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { context?: any }>((props, ref) => (
                        <div
                            {...props}
                            ref={ref}
                            className="snap-y snap-mandatory scrollbar-hide h-full overflow-y-scroll"
                            style={{ ...props.style, scrollbarWidth: 'none' }}
                        />
                    ))
                }}
            />

            {/* End of Surah Alert */}
            <AnimatePresence>
                {showEndSurahAlert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6 point-events-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full border border-white/10 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="h-8 w-8 text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Surah Completed</h3>
                            <p className="text-slate-400 mb-8">
                                You have finished Surah {ayahs[currentIndex]?.surah?.englishName}. Would you like to continue to the next Surah?
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleNextSurah}
                                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors"
                                >
                                    Continue to Next Surah
                                </button>
                                <button
                                    onClick={() => setShowEndSurahAlert(false)}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-colors"
                                >
                                    Stay Here
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tajweed Explanation Modal */}
            <AnimatePresence>
                {selectedTajweed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6 point-events-auto"
                        onClick={() => setSelectedTajweed(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full border border-white/10 text-center relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Background Glow */}
                            <div
                                className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                style={{ backgroundColor: selectedTajweed.color }}
                            />
                            <div
                                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20"
                                style={{ backgroundColor: selectedTajweed.color }}
                            />

                            <div className="relative z-10">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                                    style={{ backgroundColor: `${selectedTajweed.color}20`, border: `1px solid ${selectedTajweed.color}40` }}
                                >
                                    <span className="text-3xl font-bold" style={{ color: selectedTajweed.color }}>
                                        Aa
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">
                                    {selectedTajweed.description}
                                </h3>

                                <p className="text-slate-400 mb-8">
                                    {selectedTajweed.details}
                                </p>

                                <button
                                    onClick={() => setSelectedTajweed(null)}
                                    className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors border border-white/5"
                                >
                                    Got it
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Surah Selector Modal */}
            <AnimatePresence>
                {showSurahSelector && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 point-events-auto"
                        onClick={() => setShowSurahSelector(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md border-b border-white/10 p-6 z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-white">Choose Surah</h2>
                                    <button
                                        onClick={() => setShowSurahSelector(false)}
                                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                                    >
                                        <X className="h-5 w-5 text-white" />
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400" />
                                    <input
                                        type="text"
                                        placeholder="Search surah..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Surah List */}
                            <div className="overflow-y-auto max-h-[calc(80vh-180px)] p-4">
                                <div className="grid grid-cols-1 gap-2">
                                    {filteredSurahs.map((surah) => (
                                        <motion.button
                                            key={surah.number}
                                            onClick={() => handleChangeSurah(surah.number)}
                                            className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl p-4 transition-all border border-white/5 hover:border-emerald-500/30 text-left"
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Surah Number */}
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:border-emerald-500/50 transition-colors">
                                                    <span className="text-emerald-400 font-bold text-lg">{surah.number}</span>
                                                </div>

                                                {/* Surah Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-white font-semibold text-lg mb-1">{surah.name}</h3>
                                                    <p className="text-slate-400 text-sm">{surah.translation}</p>
                                                </div>

                                                {/* Verses & Type */}
                                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                    <span className="text-slate-400 text-xs bg-white/5 px-2 py-1 rounded-full border border-white/5">
                                                        {surah.verses} verses
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded-full border ${surah.revelation === 'Mecca'
                                                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                                                        : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                                                        }`}>
                                                        {surah.revelation}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>

                                {/* No Results */}
                                {filteredSurahs.length === 0 && (
                                    <div className="text-center py-12">
                                        <BookOpen className="h-16 w-16 text-white/10 mx-auto mb-4" />
                                        <p className="text-white/30 text-lg">No surahs found</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .font-arabic {
                    font-family: 'Scheherazade New', serif;
                }
            `}</style>
        </div>
    )
}
