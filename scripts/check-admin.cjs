const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAdmins() {
  try {
    const admins = await prisma.admin.findMany()
    
    console.log('현재 어드민 계정 목록:')
    if (admins.length === 0) {
      console.log('어드민 계정이 없습니다.')
    } else {
      admins.forEach(admin => {
        console.log(`- ID: ${admin.id}`)
        console.log(`  사용자명: ${admin.username}`)
        console.log(`  이메일: ${admin.email}`)
        console.log(`  생성일: ${admin.createdAt}`)
        console.log('---')
      })
    }
  } catch (error) {
    console.error('어드민 계정 조회 실패:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdmins()