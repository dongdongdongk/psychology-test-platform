const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function addAdmin() {
  try {
    // 기본 어드민 계정 정보
    const adminData = {
      id: 'admin_' + Date.now(),
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123' // 실제 운영에서는 더 강력한 비밀번호 사용
    }

    // 비밀번호 해싱
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds)

    // 기존 어드민 계정 확인
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: adminData.username }
    })

    if (existingAdmin) {
      console.log('이미 admin 계정이 존재합니다.')
      return
    }

    // 새 어드민 계정 생성
    const admin = await prisma.admin.create({
      data: {
        id: adminData.id,
        username: adminData.username,
        email: adminData.email,
        passwordHash: hashedPassword
      }
    })

    console.log('어드민 계정이 성공적으로 생성되었습니다:')
    console.log('사용자명:', adminData.username)
    console.log('이메일:', adminData.email)
    console.log('비밀번호:', adminData.password)
    console.log('ID:', admin.id)

  } catch (error) {
    console.error('어드민 계정 생성 실패:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addAdmin()