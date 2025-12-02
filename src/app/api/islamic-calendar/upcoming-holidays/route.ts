import { NextResponse } from 'next/server'
import { getUpcomingHolidays } from '@/lib/api/islamic-calendar'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
    try {
        const holidays = await getUpcomingHolidays()
        return NextResponse.json(holidays)
    } catch (error) {
        console.error('Error fetching upcoming holidays:', error)
        return NextResponse.json(
            { error: 'Failed to fetch upcoming holidays' },
            { status: 500 }
        )
    }
}
