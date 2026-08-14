import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const link = await db.linkBlock.findUnique({
      where: { id },
    })

    if (!link) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Increment click count & record analytics log entry
    await db.linkBlock.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    })

    await db.analyticsLog.create({
      data: {
        type: 'CLICK',
        linkId: id,
      },
    })

    return NextResponse.redirect(link.url)
  } catch (error) {
    console.error('Error handling click redirect:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
