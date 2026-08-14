import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const username = process.env.ADMIN_USERNAME || 'rececowear'
  const rawPassword = process.env.ADMIN_PASSWORD || 'adminpassword123'
  const passwordHash = await bcrypt.hash(rawPassword, 10)

  // Upsert Admin User
  const admin = await prisma.adminUser.upsert({
    where: { username },
    update: {},
    create: {
      username,
      passwordHash,
      displayName: 'Rececowear',
      bio: 'Fashion & Clothing Recommendation Links',
      backgroundColor: '#ffffff',
      cardBackgroundColor: '#ffffff',
      cardTextColor: '#333333',
    },
  })

  console.log('Admin user ready:', admin.username)

  // Seed sample products if none exist
  const count = await prisma.linkBlock.count()
  if (count === 0) {
    const sampleLinks = [
      {
        title: 'C001 (banyak warna)',
        url: 'https://shopee.co.id/search?keyword=cardigan%20c001',
        imageUrl: '/images/sample_c001.svg',
        position: 1,
        clicks: 3,
      },
      {
        title: 'C002 (banyak warna)',
        url: 'https://shopee.co.id/search?keyword=cardigan%20c002',
        imageUrl: '/images/sample_c002.svg',
        position: 2,
        clicks: 1,
      },
      {
        title: 'C003 (banyak warna)',
        url: 'https://shopee.co.id/search?keyword=cardigan%20c003',
        imageUrl: '/images/sample_c003.svg',
        position: 3,
        clicks: 0,
      },
      {
        title: 'C004 (banyak warna)',
        url: 'https://shopee.co.id/search?keyword=cardigan%20c004',
        imageUrl: '/images/sample_c004.svg',
        position: 4,
        clicks: 1,
      },
      {
        title: 'C005 (banyak warna)',
        url: 'https://shopee.co.id/search?keyword=cardigan%20c005',
        imageUrl: '/images/sample_c005.svg',
        position: 5,
        clicks: 0,
      },
    ]

    for (const link of sampleLinks) {
      const created = await prisma.linkBlock.create({ data: link })

      // Create sample analytics logs
      await prisma.analyticsLog.create({
        data: {
          type: 'VIEW',
          createdAt: new Date(),
        },
      })

      if (link.clicks > 0) {
        for (let i = 0; i < link.clicks; i++) {
          await prisma.analyticsLog.create({
            data: {
              type: 'CLICK',
              linkId: created.id,
              createdAt: new Date(),
            },
          })
        }
      }
    }
    console.log('Sample Shopee product links seeded!')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
