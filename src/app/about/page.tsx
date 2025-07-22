import Link from 'next/link'
import Header from '@/components/common/Header'
import { FaStar, FaBullseye, FaMobile, FaLock, FaPalette } from 'react-icons/fa'
import styles from './About.module.scss'

export const metadata = {
  title: '소개 - 심리테스트 플랫폼',
  description: '나를 알아가는 여행을 시작해보세요. 다양한 심리테스트를 통해 자신을 더 깊이 이해할 수 있습니다.',
}

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <Header />
      
      <div className={styles.contentWrapper}>
        <div className={styles.contentContainer}>
          <div className={styles.heroSection}>
            <h1 className={styles.heroTitle}>나를 알아가는 여행</h1>
            <p className={styles.heroSubtitle}>
              심리테스트 플랫폼과 함께 자신의 내면을 탐험해보세요
            </p>
          </div>
          <section className={styles.missionSection}>
            <div className={styles.sectionContent}>
              <h2 className={styles.sectionTitle}>우리의 미션</h2>
              <p className={styles.sectionText}>
                모든 사람이 자신을 더 깊이 이해하고, 내면의 잠재력을 발견할 수 있도록 돕는 것입니다.
                과학적이고 재미있는 심리테스트를 통해 자기 발견의 여행을 함께하고자 합니다.
              </p>
            </div>
            <div className={styles.missionImage}>
              <div className={styles.imageIcon}><FaStar /></div>
            </div>
          </section>

          <section className={styles.featuresSection}>
            <h2 className={styles.sectionTitle}>왜 우리 플랫폼인가요?</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}><FaBullseye /></div>
                <h3 className={styles.featureTitle}>과학적 근거</h3>
                <p className={styles.featureText}>
                  심리학 이론을 바탕으로 한 검증된 테스트들로 신뢰할 수 있는 결과를 제공합니다.
                </p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}><FaMobile /></div>
                <h3 className={styles.featureTitle}>편리한 접근</h3>
                <p className={styles.featureText}>
                  언제 어디서나 모바일로 쉽게 접근할 수 있어 편리하게 테스트할 수 있습니다.
                </p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}><FaLock /></div>
                <h3 className={styles.featureTitle}>개인정보 보호</h3>
                <p className={styles.featureText}>
                  익명으로 진행되며 개인정보는 수집하지 않아 안전하게 이용할 수 있습니다.
                </p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}><FaPalette /></div>
                <h3 className={styles.featureTitle}>다양한 테스트</h3>
                <p className={styles.featureText}>
                  성격, 심리상태, 연애스타일 등 다양한 분야의 테스트를 제공합니다.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.statsSection}>
            <h2 className={styles.sectionTitle}>함께한 성과</h2>
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>100,000+</div>
                <div className={styles.statLabel}>테스트 참여자</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>50+</div>
                <div className={styles.statLabel}>다양한 테스트</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>98%</div>
                <div className={styles.statLabel}>사용자 만족도</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>24/7</div>
                <div className={styles.statLabel}>언제든 이용 가능</div>
              </div>
            </div>
          </section>

          <section className={styles.ctaSection}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>지금 바로 시작해보세요!</h2>
              <p className={styles.ctaText}>
                당신만의 특별한 발견이 기다리고 있습니다
              </p>
              <Link href="/" className={styles.ctaButton}>
                테스트 하러 가기
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}