import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const totalViews = await db.analyticsLog.count({
      where: { type: 'VIEW' },
    })

    const totalClicks = await db.analyticsLog.count({
      where: { type: 'CLICK' },
    })

    // Group analytics by date for the chart (last 7 days)
    const logs = await db.analyticsLog.findMany({
      orderBy: { createdAt: 'asc' },
    })

    // Generate date map for recent dates
    const dateMap: Record<string, { views: number; clicks: number }> = {}

    // Pre-populate last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const label = `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })}`
      dateMap[label] = { views: 0, clicks: 0 }
    }

    logs.forEach((log) => {
      const d = new Date(log.createdAt)
      const label = `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })}`
      if (!dateMap[label]) {
        dateMap[label] = { views: 0, clicks: 0 }
      }
      if (log.type === 'VIEW') {
        dateMap[label].views += 1
      } else if (log.type === 'CLICK') {
        dateMap[label].clicks += 1
      }
    })

    const chartData = Object.entries(dateMap).map(([date, data]) => ({
      date,
      Views: data.views,
      Clicks: data.clicks,
    }))

    return NextResponse.json({
      totalViews,
      totalClicks,
      chartData,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
