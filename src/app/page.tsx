import { Suspense } from 'react'
import Link from 'next/link'
import TestList from '@/components/TestList'
import styles from './HomePage.module.scss'

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>🧠</span>
              심리테스트 플랫폼
            </Link>
            <ul className={styles.navLinks}>
              <li>
                <Link href="/" className={styles.navLink}>홈</Link>
              </li>
              <li>
                <Link href="/about" className={styles.navLink}>소개</Link>
              </li>
              <li>
                <Link href="/faq" className={styles.navLink}>FAQ</Link>
              </li>
              <li>
                <Link href="/contact" className={styles.navLink}>문의</Link>
              </li>
              <li>
                <Link href="/admin/login" className={styles.navLink}>관리자</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      
      <div className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              나를 알아가는 여행
            </h1>
            <p className={styles.heroSubtitle}>
              다양한 심리테스트를 통해 자신을 더 깊이 이해하고
              <br />
              새로운 면을 발견해보세요
            </p>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>100+</span>
                <span className={styles.statLabel}>심리테스트</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>10K+</span>
                <span className={styles.statLabel}>참여자</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>98%</span>
                <span className={styles.statLabel}>만족도</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.mainContent}>
        <Suspense fallback={
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>테스트 목록을 불러오는 중...</p>
          </div>
        }>
          <TestList />
        </Suspense>
      </div>
    </main>
  )
}