import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Qalbu - Your Islamic Companion'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #fdfcfb 0%, #f3ede6 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'system-ui',
                }}
            >
                <div
                    style={{
                        fontSize: 120,
                        marginBottom: 20,
                    }}
                >
                    🕌
                </div>
                <div
                    style={{
                        fontSize: 80,
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #e9a84a 0%, #d88d2f 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: 20,
                    }}
                >
                    Qalbu
                </div>
                <div
                    style={{
                        fontSize: 32,
                        color: '#6f6250',
                        textAlign: 'center',
                        maxWidth: 800,
                    }}
                >
                    Your spiritual companion for prayer times, Quran, and Qibla direction
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
