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
      category: '멘탈헬스',
      thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      testUrl: '/tests/stress-test',
      isActive: true
    }
  })

  // Create additional sample tests
  const personalityTest = await prisma.test.upsert({
    where: { id: 'personality-preview' },
    update: {},
    create: {
      id: 'personality-preview',
      title: '성격 유형 미리보기',
      description: '당신의 성격 유형을 간단하게 알아보는 테스트입니다. (개발 예정)',
      category: '성격분석',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      testUrl: '/tests/personality-preview',
      isActive: false
    }
  })

  const loveTest = await prisma.test.upsert({
    where: { id: 'love-style-preview' },
    update: {},
    create: {
      id: 'love-style-preview',
      title: '연애 스타일 테스트',
      description: '당신의 연애 스타일과 이상형을 알아보는 테스트입니다. (개발 예정)',
      category: '연애',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518621012420-8ab2803d6da5?w=400&h=300&fit=crop',
      testUrl: '/tests/love-style-preview',
      isActive: false
    }
  })

  const careerTest = await prisma.test.upsert({
    where: { id: 'career-preview' },
    update: {},
    create: {
      id: 'career-preview',
      title: '직업 적성 테스트',
      description: '나에게 맞는 직업과 진로를 찾아보는 테스트입니다. (개발 예정)',
      category: '진로',
      thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
      testUrl: '/tests/career-preview',
      isActive: false
    }
  })

  console.log('Created stress test:', stressTest)
  console.log('Created personality test:', personalityTest)
  console.log('Created love test:', loveTest)
  console.log('Created career test:', careerTest)

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