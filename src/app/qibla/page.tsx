'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Compass, Camera, MapPin, Loader2, AlertCircle, ArrowLeft, Navigation } from 'lucide-react'
import { useQibla, useCameraStream } from '@/hooks/use-qibla'
import { useLanguage } from '@/contexts/language-context'
import { getReverseGeocoding, type LocationData } from '@/lib/api/prayer-times'
import { usePWAMode } from '@/hooks/use-pwa-mode'
import { cn } from '@/lib/utils'

type Mode = 'compass' | 'camera'

export default function QiblaPage() {
    const [mode, setMode] = useState<Mode>('compass')
    const [locationName, setLocationName] = useState<LocationData | null>(null)
    const { t } = useLanguage()
    const isPwa = usePWAMode()
    const {
        qiblaDirection,
        deviceHeading,
        relativeDirection,
        isSupported,
        permissionGranted,
        requestPermission,
        coordinates,
        isLoading: qiblaLoading,
        error: qiblaError,
    } = useQibla()

    const {
        stream,
        error: cameraError,
        isLoading: cameraLoading,
        startCamera,
        stopCamera,
    } = useCameraStream()

    // Fetch location name when coordinates change
    useEffect(() => {
        if (coordinates) {
            getReverseGeocoding(coordinates)
                .then(setLocationName)
                .catch(console.error)
        }
    }, [coordinates])

    const handleModeChange = async (newMode: Mode) => {
        if (newMode === 'camera') {
            if (!stream) {
                await startCamera()
            }
        } else {
            stopCamera()
        }
        setMode(newMode)
    }

    const handleRequestPermission = async () => {
        await requestPermission()
    }

    return (
        <main className={cn(
            "min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-950 to-slate-950",
            isPwa ? 'pb-24' : ''
        )}>
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center relative"
                >
                    {!isPwa && (
                        <div className="absolute left-0 top-0 md:left-4">
                            <Link href="/">
                                <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10">
                                    <ArrowLeft className="h-4 w-4" />
                                    <span className="hidden sm:inline">{t.common.home}</span>
                                </Button>
                            </Link>
                        </div>
                    )}
                    <h1 className="mb-2 text-4xl font-bold md:text-5xl pt-8 md:pt-0">
                        <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                            {t.qiblaPage.title}
                        </span>
                    </h1>
                    <p className="text-lg text-slate-400">{t.qiblaPage.subtitle}</p>
                </motion.div>

                {/* Mode Selector */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="mx-auto flex max-w-md gap-2 rounded-full bg-white/5 p-1.5 border border-white/10 backdrop-blur-md">
                        <Button
                            variant="ghost"
                            className={cn(
                                "flex-1 rounded-full transition-all duration-300",
                                mode === 'compass'
                                    ? "bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                            )}
                            onClick={() => handleModeChange('compass')}
                        >
                            <Compass className="mr-2 h-4 w-4" />
                            {t.qiblaPage.compass}
                        </Button>
                        <Button
                            variant="ghost"
                            className={cn(
                                "flex-1 rounded-full transition-all duration-300",
                                mode === 'camera'
                                    ? "bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                            )}
                            onClick={() => handleModeChange('camera')}
                        >
                            <Camera className="mr-2 h-4 w-4" />
                            {t.qiblaPage.camera}
                        </Button>
                    </div>
                </motion.div>

                {/* Location Info */}
                {coordinates && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6"
                    >
                        <div className="glass rounded-2xl p-4 border-emerald-500/10 bg-emerald-500/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                        <MapPin className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        {(locationName?.city || locationName?.formatted) ? (
                                            <>
                                                <span className="text-sm font-medium text-slate-200 line-clamp-1">
                                                    {locationName.city && locationName.country
                                                        ? `${locationName.city}, ${locationName.country}`
                                                        : locationName.formatted}
                                                </span>
                                                <span className="text-xs text-emerald-400/80 font-mono">
                                                    {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-sm text-slate-200">
                                                {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {qiblaDirection && (
                                    <div className="text-right">
                                        <span className="text-xs text-slate-400 block">{t.common.qibla}</span>
                                        <span className="text-lg font-bold text-emerald-400 font-mono">
                                            {qiblaDirection.toFixed(1)}°
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Error States */}
                {(qiblaError || cameraError) && (
                    <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                            <div>
                                <p className="font-medium text-red-400">{t.common.error}</p>
                                <p className="text-sm text-red-400/80">
                                    {qiblaError || cameraError}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Permission Request */}
                {isSupported && !permissionGranted && mode === 'compass' && (
                    <div className="mb-6 glass rounded-3xl p-8 text-center">
                        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                            <Compass className="h-8 w-8 text-emerald-400" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-white">{t.qiblaPage.permissionTitle}</h3>
                        <p className="mb-8 text-slate-400 max-w-xs mx-auto">
                            {t.qiblaPage.enableCompassDesc}
                        </p>
                        <Button
                            onClick={handleRequestPermission}
                            className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white border-0 shadow-lg shadow-emerald-500/20 rounded-xl px-8"
                        >
                            {t.qiblaPage.enableCompass}
                        </Button>
                    </div>
                )}

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {mode === 'compass' ? (
                        <CompassMode
                            qiblaDirection={qiblaDirection}
                            deviceHeading={deviceHeading}
                            relativeDirection={relativeDirection}
                            isLoading={qiblaLoading}
                            isSupported={isSupported && permissionGranted}
                        />
                    ) : (
                        <CameraMode
                            stream={stream}
                            relativeDirection={relativeDirection}
                            isLoading={cameraLoading}
                        />
                    )}
                </motion.div>
            </div>
        </main>
    )
}

function CompassMode({
    qiblaDirection,
    deviceHeading,
    relativeDirection,
    isLoading,
    isSupported,
}: {
    qiblaDirection: number | null
    deviceHeading: number
    relativeDirection: number
    isLoading: boolean
    isSupported: boolean
}) {
    const { t } = useLanguage()

    if (isLoading) {
        return (
            <div className="glass rounded-[40px] p-20 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-400" />
            </div>
        )
    }

    const isAligned = Math.abs(relativeDirection) < 5

    return (
        <div className="glass rounded-[40px] overflow-hidden border-emerald-500/10">
            <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 p-6 border-b border-white/5">
                <h2 className="text-center text-xl font-medium text-emerald-100">{t.qiblaPage.compassMode}</h2>
            </div>
            <div className="p-8 md:p-12 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />

                {/* Compass Circle */}
                <div className="relative mx-auto aspect-square w-full max-w-[300px]">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-950/80 backdrop-blur-xl">
                        {/* Inner Bezel */}
                        <div className="absolute inset-2 rounded-full border border-white/5 bg-gradient-to-br from-white/5 to-transparent" />

                        {/* Cardinal Directions */}
                        <div className="absolute left-1/2 top-4 -translate-x-1/2 text-sm font-bold text-emerald-500">N</div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">E</div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-bold text-slate-500">S</div>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">W</div>

                        {/* Degree Markers */}
                        {Array.from({ length: 72 }).map((_, i) => {
                            const angle = i * 5
                            const isCardinal = angle % 90 === 0
                            const isMajor = angle % 30 === 0
                            return (
                                <div
                                    key={i}
                                    className="absolute left-1/2 top-1/2 h-[42%] origin-bottom"
                                    style={{
                                        transform: `rotate(${angle}deg)`,
                                        width: '1px'
                                    }}
                                >
                                    <div
                                        className={cn(
                                            "w-full rounded-full",
                                            isCardinal ? "h-3 bg-emerald-500" :
                                                isMajor ? "h-2 bg-slate-600" : "h-1 bg-slate-800"
                                        )}
                                    />
                                </div>
                            )
                        })}
                    </div>

                    {/* Qibla Needle Container - Rotates */}
                    {isSupported && (
                        <div
                            className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform"
                            style={{ transform: `rotate(${-deviceHeading}deg)` }}
                        >
                            {/* The Needle pointing to Qibla */}
                            <div
                                className="absolute left-1/2 top-1/2 h-[40%] w-1.5 origin-bottom"
                                style={{ transform: `translate(-50%, -100%) rotate(${qiblaDirection || 0}deg)` }}
                            >
                                <div className={cn(
                                    "h-full w-full rounded-full relative transition-all duration-500",
                                    isAligned
                                        ? "bg-gradient-to-t from-emerald-500 to-teal-400 shadow-[0_0_20px_rgba(16,185,129,0.6)]"
                                        : "bg-gradient-to-t from-slate-600 to-slate-400 opacity-50"
                                )}>
                                    {/* Arrow Head */}
                                    <div className={cn(
                                        "absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent transition-colors duration-500",
                                        isAligned ? "border-b-teal-400" : "border-b-slate-400"
                                    )} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Center Piece */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className={cn(
                            "h-24 w-24 rounded-full flex items-center justify-center transition-all duration-500",
                            isAligned
                                ? "bg-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.4)] border border-emerald-500/30"
                                : "bg-slate-900/50 border border-white/5"
                        )}>
                            <div className={cn(
                                "text-4xl transition-all duration-500 transform",
                                isAligned ? "scale-110 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" : "opacity-50 grayscale"
                            )}>
                                🕋
                            </div>
                        </div>
                    </div>

                    {/* Direction Info - Inside Compass */}
                    <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 text-center w-full z-20">
                        <p className="mb-1 text-[10px] text-slate-400 uppercase tracking-widest font-medium">{t.qiblaPage.title}</p>
                        <div className="flex items-baseline justify-center gap-0.5">
                            <span className={cn(
                                "text-4xl font-bold font-mono transition-colors duration-300 drop-shadow-lg",
                                isAligned ? "text-emerald-400" : "text-white"
                            )}>
                                {relativeDirection.toFixed(0)}
                            </span>
                            <span className="text-lg text-slate-400">°</span>
                        </div>

                        {isAligned && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-emerald-400 text-xs font-medium flex items-center justify-center gap-1.5 bg-emerald-500/10 py-1 px-3 rounded-full mx-auto w-fit border border-emerald-500/20 backdrop-blur-sm"
                            >
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                You are facing the Qibla
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Device Heading Info */}
                {isSupported && (
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                            <Navigation className={cn("h-3.5 w-3.5", isAligned ? "text-emerald-400" : "text-slate-400")} />
                            <p className="text-xs text-slate-400 font-mono">
                                {t.qiblaPage.deviceHeading}: {deviceHeading.toFixed(0)}°
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function CameraMode({
    stream,
    relativeDirection,
    isLoading,
}: {
    stream: MediaStream | null
    relativeDirection: number
    isLoading: boolean
}) {
    const { t } = useLanguage()

    if (isLoading) {
        return (
            <div className="glass rounded-[40px] p-20 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-400" />
            </div>
        )
    }

    const isAligned = Math.abs(relativeDirection) < 5

    return (
        <div className="glass rounded-[40px] overflow-hidden border-emerald-500/10">
            <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 p-6 border-b border-white/5">
                <h2 className="text-center text-xl font-medium text-emerald-100">{t.qiblaPage.cameraMode}</h2>
            </div>
            <div className="p-0">
                <div className="relative aspect-[9/16] md:aspect-video w-full overflow-hidden bg-black">
                    {stream ? (
                        <>
                            <video
                                autoPlay
                                playsInline
                                muted
                                ref={(video) => {
                                    if (video && stream) {
                                        video.srcObject = stream
                                    }
                                }}
                                className="h-full w-full object-cover opacity-80"
                            />

                            {/* AR Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Grid Overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

                                {/* Qibla Direction Indicator */}
                                <div
                                    className="transition-transform duration-300 z-10"
                                    style={{ transform: `rotate(${relativeDirection}deg)` }}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className={cn(
                                            "mb-4 h-32 w-1 bg-gradient-to-t transition-colors duration-300",
                                            isAligned ? "from-emerald-500 to-transparent" : "from-white/50 to-transparent"
                                        )} />
                                        <div className={cn(
                                            "flex h-24 w-24 items-center justify-center rounded-full text-4xl shadow-2xl backdrop-blur-md border transition-all duration-300",
                                            isAligned
                                                ? "bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                                                : "bg-black/40 border-white/10"
                                        )}>
                                            🕋
                                        </div>
                                        <div className={cn(
                                            "mt-4 rounded-full px-6 py-2 backdrop-blur-md border transition-colors duration-300",
                                            isAligned ? "bg-emerald-500/20 border-emerald-500/30" : "bg-black/40 border-white/10"
                                        )}>
                                            <p className={cn(
                                                "text-lg font-bold font-mono",
                                                isAligned ? "text-emerald-400" : "text-white"
                                            )}>
                                                {relativeDirection.toFixed(0)}°
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Crosshair */}
                                <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-0.5 bg-white/50" />
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-3 w-0.5 bg-white/50" />
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-white/50" />
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-white/50" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center flex-col gap-4 p-8 text-center">
                            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                                <Camera className="h-8 w-8 text-slate-400" />
                            </div>
                            <p className="text-slate-400 max-w-xs">{t.qiblaPage.cameraNotAvailable}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
