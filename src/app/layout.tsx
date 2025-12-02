import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { AudioProvider } from '@/contexts/audio-context'
import { LanguageProvider } from '@/contexts/language-context'
import { MiniPlayer } from '@/components/audio/mini-player'
import { NotificationManager } from '@/components/prayer/notification-manager'
import { PWALayout } from '@/components/pwa/pwa-layout'
import { Suspense } from 'react'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#e0f2f1' },
        { media: '(prefers-color-scheme: dark)', color: '#0a1929' },
    ],
}

export const metadata: Metadata = {
    title: {
        default: 'Qalbu - For nurturing your faith',
        template: '%s | Qalbu',
    },
    description:
        'A modern, elegant Islamic application featuring prayer times, full Quran with audio, Qibla direction, and more. For nurturing your faith.',
    keywords: [
        'Islamic app',
        'Prayer times',
        'Quran',
        'Qibla',
        'Muslim',
        'Salah',
        'Islamic calendar',
        'Tasbih',
        'Dua',
    ],
    authors: [{ name: 'Qalbu Team' }],
    creator: 'Qalbu',
    publisher: 'Qalbu',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://qalbu.ai'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://qalbu.ai',
        title: 'Qalbu - For nurturing your faith',
        description:
            'A modern, elegant Islamic application featuring prayer times, full Quran with audio, Qibla direction, and more.',
        siteName: 'Qalbu',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Qalbu - For nurturing your faith',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Qalbu - For nurturing your faith',
        description:
            'A modern, elegant Islamic application featuring prayer times, full Quran with audio, Qibla direction, and more.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: [
            { url: '/icons/qalbuIcon.png' },
            { url: '/icons/qalbuIcon.png', sizes: '192x192', type: 'image/png' },
            { url: '/icons/qalbuIcon.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [{ url: '/icons/AppIcon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Qalbu',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet" />
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body className={`${inter.variable} font-sans antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <QueryProvider>
                        <Suspense fallback={null}>
                            <LanguageProvider>
                                <AudioProvider>
                                    <PWALayout>
                                        {children}
                                    </PWALayout>
                                    <MiniPlayer />
                                    <NotificationManager />
                                </AudioProvider>
                            </LanguageProvider>
                        </Suspense>
                    </QueryProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
