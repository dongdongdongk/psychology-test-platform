import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const hashedPassword = await hashPassword('admin123')
  
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      id: uuidv4(),
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: hashedPassword
    }
  })

  console.log('Created admin user:', admin)

  // Create stress test
  const stressTest = await prisma.test.upsert({
    where: { id: 'stress-test' },
    update: {},
    create: {
      id: 'stress-test',
      title: '스트레스 지수 테스트',
      description: '최근 일주일간의 스트레스 수준을 측정하는 심리테스트입니다. 총 10개의 질문을 통해 현재 스트레스 상태를 파악하고 적절한 관리법을 제안받아보세요.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      testUrl: '/tests/stress-test',
      isActive: true
    }
  })

  console.log('Created stress test:', stressTest)

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })