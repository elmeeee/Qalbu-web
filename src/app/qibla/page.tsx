'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Compass, Camera, MapPin, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { useQibla, useCameraStream } from '@/hooks/use-qibla'
import { useLanguage } from '@/contexts/language-context'
import { getReverseGeocoding, type LocationData } from '@/lib/api/prayer-times'
import { usePWAMode } from '@/hooks/use-pwa-mode'

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
        <main className={`min-h-screen bg-gradient-to-b from-sand-50 via-white to-sand-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 ${isPwa ? 'pb-24' : ''}`}>
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
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    <span className="hidden sm:inline">{t.common.home}</span>
                                </Button>
                            </Link>
                        </div>
                    )}
                    <h1 className="mb-4 text-4xl font-bold md:text-5xl pt-8 md:pt-0">
                        <span className="gradient-text">{t.qiblaPage.title}</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">{t.qiblaPage.subtitle}</p>
                </motion.div>

                {/* Mode Selector */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="mx-auto flex max-w-md gap-2 rounded-2xl bg-muted p-2">
                        <Button
                            variant={mode === 'compass' ? 'default' : 'ghost'}
                            className="flex-1 rounded-xl"
                            onClick={() => handleModeChange('compass')}
                        >
                            <Compass className="mr-2 h-4 w-4" />
                            {t.qiblaPage.compass}
                        </Button>
                        <Button
                            variant={mode === 'camera' ? 'default' : 'ghost'}
                            className="flex-1 rounded-xl"
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
                        <Card className="glass">
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-2 flex-1">
                                    <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                    <div className="flex flex-col">
                                        {locationName?.formatted ? (
                                            <>
                                                <span className="text-sm font-medium">
                                                    {locationName.formatted}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-sm">
                                                {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {qiblaDirection && (
                                    <span className="text-sm font-medium whitespace-nowrap ml-2">
                                        {t.common.qibla}: {qiblaDirection.toFixed(1)}°
                                    </span>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Error States */}
                {(qiblaError || cameraError) && (
                    <Card className="mb-6 border-destructive/50">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                                <div>
                                    <p className="font-medium text-destructive">{t.common.error}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {qiblaError || cameraError}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Permission Request */}
                {isSupported && !permissionGranted && mode === 'compass' && (
                    <Card className="mb-6">
                        <CardContent className="p-6 text-center">
                            <Compass className="mx-auto mb-4 h-12 w-12 text-blue-600" />
                            <h3 className="mb-2 text-xl font-bold">{t.qiblaPage.permissionTitle}</h3>
                            <p className="mb-6 text-muted-foreground">
                                {t.qiblaPage.enableCompassDesc}
                            </p>
                            <Button onClick={handleRequestPermission} className="bg-blue-600 hover:bg-blue-700">
                                {t.qiblaPage.enableCompass}
                            </Button>
                        </CardContent>
                    </Card>
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
            <Card className="premium-card">
                <CardContent className="flex items-center justify-center p-20">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="premium-card overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <CardTitle className="text-center text-2xl">{t.qiblaPage.compassMode}</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                {/* Compass Circle */}
                <div className="relative mx-auto aspect-square max-w-md">
                    {/* Compass Background */}
                    <div className="absolute inset-0 rounded-full border-[3px] border-gray-300 dark:border-gray-700 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-900 shadow-2xl">
                        {/* Cardinal Directions */}
                        <div className="absolute left-1/2 top-6 -translate-x-1/2 text-lg font-bold text-foreground">N</div>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-bold text-foreground">E</div>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-lg font-bold text-foreground">S</div>
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-lg font-bold text-foreground">W</div>

                        {/* Degree Markers - More precise */}
                        {Array.from({ length: 72 }).map((_, i) => {
                            const angle = i * 5
                            const isCardinal = angle % 90 === 0
                            const isMajor = angle % 30 === 0
                            return (
                                <div
                                    key={i}
                                    className="absolute left-1/2 top-1/2 h-1/2 origin-bottom"
                                    style={{
                                        transform: `rotate(${angle}deg)`,
                                        width: '1px'
                                    }}
                                >
                                    <div
                                        className={`w-full ${isCardinal
                                            ? 'h-6 bg-foreground'
                                            : isMajor
                                                ? 'h-4 bg-foreground/70'
                                                : 'h-2 bg-foreground/40'
                                            }`}
                                    />
                                </div>
                            )
                        })}
                    </div>

                    {/* Qibla Needle */}
                    {isSupported && (
                        <div
                            className="absolute left-1/2 top-1/2 h-1/2 w-1.5 origin-bottom transition-transform duration-300 ease-out"
                            style={{ transform: `translate(-50%, -100%) rotate(${relativeDirection}deg)` }}
                        >
                            <div className="h-full w-full bg-gradient-to-t from-blue-600 to-blue-400 shadow-xl rounded-full">
                                <div className="absolute -top-4 left-1/2 h-0 w-0 -translate-x-1/2 border-b-[16px] border-l-[10px] border-r-[10px] border-b-blue-600 border-l-transparent border-r-transparent drop-shadow-lg" />
                            </div>
                        </div>
                    )}

                    {/* Center Point */}
                    <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-3xl text-white shadow-2xl ring-4 ring-white dark:ring-gray-800">
                        🕋
                    </div>
                </div>

                {/* Direction Info */}
                <div className="mt-8 text-center">
                    <p className="mb-2 text-sm text-muted-foreground">{t.qiblaPage.title}</p>
                    <p className="text-4xl font-bold text-blue-600">
                        {relativeDirection.toFixed(0)}°
                    </p>
                    {isSupported && (
                        <p className="mt-4 text-sm text-muted-foreground">
                            {t.qiblaPage.deviceHeading}: {deviceHeading.toFixed(0)}°
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
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
            <Card className="premium-card">
                <CardContent className="flex items-center justify-center p-20">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="premium-card overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <CardTitle className="text-center text-2xl">{t.qiblaPage.cameraMode}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="relative aspect-video w-full overflow-hidden bg-black">
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
                                className="h-full w-full object-cover"
                            />

                            {/* AR Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Qibla Direction Indicator */}
                                <div
                                    className="transition-transform duration-300"
                                    style={{ transform: `rotate(${relativeDirection}deg)` }}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="mb-4 h-32 w-1 bg-gradient-to-t from-blue-600 to-transparent" />
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/90 text-3xl shadow-2xl backdrop-blur-sm">
                                            🕋
                                        </div>
                                        <div className="mt-4 rounded-full bg-black/50 px-4 py-2 backdrop-blur-sm">
                                            <p className="text-sm font-bold text-white">
                                                {relativeDirection.toFixed(0)}°
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Crosshair */}
                                <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 border-2 border-white/50 rounded-full" />
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-white">{t.qiblaPage.cameraNotAvailable}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
