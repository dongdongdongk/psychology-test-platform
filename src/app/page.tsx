import { Suspense } from 'react'
import { Metadata } from 'next'
import Header from '@/components/common/Header'
import TestList from '@/components/TestList'
import HeroSection from '@/components/HeroSection'
import StructuredData from '@/components/StructuredData'
import { prisma } from '@/lib/prisma'
import { retryDbOperation } from '@/lib/db-retry'
import { Test } from '@/types'
import styles from './HomePage.module.scss'

export const metadata: Metadata = {
  title: '루노 심리테스트 - 1분 만에 나를 알아보는 무료 심리테스트',
  description: '1분이면 충분해요. 무료 심리테스트로 하루에 소소한 의미를 더해보세요. MBTI, 연애, 성격, 적성 등 다양한 심리테스트를 만나보세요.',
  keywords: '심리테스트, 무료심리테스트, MBTI, 성격테스트, 연애테스트, 적성테스트, 루노',
  openGraph: {
    title: '루노 심리테스트 - 1분 만에 나를 알아보는 무료 심리테스트',
    description: '1분이면 충분해요. 무료 심리테스트로 하루에 소소한 의미를 더해보세요.',
    type: 'website',
    locale: 'ko_KR',
  },
}

async function getTests(): Promise<Test[]> {
  try {
    const tests = await retryDbOperation(() => 
      prisma.test.findMany({
        where: {
          isActive: true
        },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          thumbnailUrl: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    )
    return tests.map(test => ({
      ...test,
      description: test.description || undefined,
      thumbnailUrl: test.thumbnailUrl || undefined
    })) as Test[]
  } catch (error) {
    console.error('Error fetching tests:', error)
    return []
  }
}

export default async function HomePage() {
  const tests = await getTests()
  return (
    <>
      <StructuredData tests={tests} />
      <main className={styles.main}>
        <Header />
        
        <div className={styles.contentWrapper}>
          <div className={styles.contentContainer}>
            <div className={styles.heroSection}>
              <div className={styles.heroContainer}>
                <HeroSection />
              </div>
            </div>
            
            <div className={styles.mainContent}>
              <div className={styles.sectionHeader}>
                <h1 className={styles.sectionTitle}>루노 심리 테스트</h1>
                <p className={styles.sectionDescription}>"1분이면 충분해요. 무료 심리테스트로 하루에 소소한 의미를 더해보세요."</p>
              </div>
              
              {/* SEO를 위한 정적 콘텐츠 - 드롭다운 형식 */}
              <div className={styles.seoDropdown}>
                <details className={styles.dropdownContainer}>
                  <summary className={styles.dropdownSummary}>
                    심리테스트 소개
                    <span className={styles.dropdownIcon}>▼</span>
                  </summary>
                  <div className={styles.dropdownContent}>
                    <p>
                      루노에서 제공하는 무료 심리테스트로 자신의 성격, 연애 스타일, 적성 등을 알아보세요. 
                      MBTI부터 재미있는 성격 테스트까지, 1분 만에 완료할 수 있는 간단하고 정확한 테스트들이 준비되어 있습니다.
                    </p>
                  </div>
                </details>
              </div>
              
              <TestList initialTests={tests} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}