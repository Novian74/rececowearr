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

    // Fetch all link blocks with their click counts
    const links = await db.linkBlock.findMany({
      orderBy: { clicks: 'desc' },
    })

    // Calculate CTR (Click-through-rate)
    const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0'

    // Format products for ranking & charts
    const productStats = links.map((link, idx) => {
      const percentage = totalClicks > 0 ? ((link.clicks / totalClicks) * 100).toFixed(1) : '0.0'
      return {
        rank: idx + 1,
        id: link.id,
        title: link.title,
        url: link.url,
        imageUrl: link.imageUrl,
        clicks: link.clicks,
        percentage: Number(percentage),
        isActive: link.isActive,
      }
    })

    // Fetch recent 10 click logs for activity stream
    const recentLogs = await db.analyticsLog.findMany({
      where: { type: 'CLICK' },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        link: true,
      },
    })

    const activityLogs = recentLogs.map((log) => ({
      id: log.id,
      productTitle: log.link?.title || 'Produk',
      imageUrl: log.link?.imageUrl || '',
      timestamp: log.createdAt,
    }))

    return NextResponse.json({
      totalViews,
      totalClicks,
      ctr,
      productStats,
      activityLogs,
    })
  } catch (error) {
    console.error('Error fetching detailed analytics:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
