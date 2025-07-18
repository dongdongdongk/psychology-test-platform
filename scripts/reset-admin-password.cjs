const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function resetAdminPassword() {
  try {
    const newPassword = 'admin123'
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    const updatedAdmin = await prisma.admin.update({
      where: { username: 'admin' },
      data: { passwordHash: hashedPassword }
    })

    console.log('어드민 비밀번호가 성공적으로 재설정되었습니다:')
    console.log('사용자명: admin')
    console.log('새 비밀번호: admin123')
    console.log('로그인 URL: /admin/login')

  } catch (error) {
    console.error('비밀번호 재설정 실패:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdminPassword()