import { NextResponse } from 'next/server'
import { getCurrentHijriDate } from '@/lib/api/islamic-calendar'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
    try {
        const hijriDate = await getCurrentHijriDate()
        return NextResponse.json(hijriDate)
    } catch (error) {
        console.error('Error fetching current Hijri date:', error)
        return NextResponse.json(
            { error: 'Failed to fetch current Hijri date' },
            { status: 500 }
        )
    }
}
