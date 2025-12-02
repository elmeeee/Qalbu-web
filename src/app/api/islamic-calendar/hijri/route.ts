import { NextRequest, NextResponse } from 'next/server'
import { getHijriCalendar } from '@/lib/api/islamic-calendar'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const month = searchParams.get('month')
        const year = searchParams.get('year')
        const latitude = searchParams.get('latitude')
        const longitude = searchParams.get('longitude')

        if (!month || !year) {
            return NextResponse.json(
                { error: 'Month and year are required' },
                { status: 400 }
            )
        }

        const hijriMonth = parseInt(month)
        const hijriYear = parseInt(year)

        if (isNaN(hijriMonth) || isNaN(hijriYear)) {
            return NextResponse.json(
                { error: 'Invalid month or year' },
                { status: 400 }
            )
        }

        const lat = latitude ? parseFloat(latitude) : undefined
        const lon = longitude ? parseFloat(longitude) : undefined

        const calendar = await getHijriCalendar(hijriMonth, hijriYear, lat, lon)
        return NextResponse.json(calendar)
    } catch (error) {
        console.error('Error fetching Hijri calendar:', error)
        return NextResponse.json(
            { error: 'Failed to fetch Hijri calendar' },
            { status: 500 }
        )
    }
}
