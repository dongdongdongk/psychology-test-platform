import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { retryDbOperation } from '@/lib/db-retry'

export async function GET() {
  try {
    const tests = await retryDbOperation(() => 
      prisma.test.findMany({
        where: {
          isActive: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    )

    return NextResponse.json(tests)
  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    )
  }
}