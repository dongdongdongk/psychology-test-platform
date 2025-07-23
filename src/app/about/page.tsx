import Link from 'next/link'
import Header from '@/components/common/Header'
import { FaHeart, FaUsers, FaRocket, FaSmile, FaCoffee, FaClock } from 'react-icons/fa'
import styles from './About.module.scss'

export const metadata = {
  title: '우리를 소개합니다 - 심리테스트 플랫폼',
  description: '하루 몇 분의 투자로 가볍게 즐기는 심리테스트, 나를 발견하고 친구들과 스몰토크를 만들어보세요.',
}

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <Header />
      
      <div className={styles.contentWrapper}>
        <div className={styles.contentContainer}>
          {/* 메인 히어로 섹션 */}
          <div className={styles.heroSection}>
            <div className={styles.heroBadge}>하루 3분, 작은 재미</div>
            <h1 className={styles.heroTitle}>
              # 가볍게 즐기는<br />
              심리테스트
            </h1>
            <p className={styles.heroQuote}>
              <em>"나는 어떤 사람일까?"</em><br />
              "오늘 주변인들과 나눌 가벼운 대화 주제가 필요하다면?"
            </p>
          </div>

          {/* 브랜드 소개 */}
          <section className={styles.brandSection}>
            <div className={styles.brandContent}>
              <p className={styles.brandText}>
                우리는 <strong>누구나 쉽고 부담 없이 즐길 수 있는</strong> 심리테스트를 제작합니다.
              </p>
              <p className={styles.brandText}>
                단순한 재미를 넘어서, <strong>나에 대해 몰랐던 부분</strong>을 발견하고
                주변 사람들과 <strong>스몰토크</strong>를 즐길 수 있는 시간을 선물하고 싶습니다.
              </p>
              <div className={styles.brandHighlight}>
                <FaSmile className={styles.brandIcon} />
                <p>
                  출근길, 점심시간, 자기 전 잠깐의 시간으로도 충분합니다.<br/>
                  <strong>"주변 사람들과 나눌 재미있는 대화 소재"</strong>를 만들어 보세요.
                </p>
              </div>
            </div>
          </section>

          {/* 콘텐츠 소개 */}
          <section className={styles.contentSection}>
            <h2 className={styles.contentTitle}>
              가벼운 대화 거리로<br />
              딱 좋은 다양한 컨텐츠
            </h2>
            <div className={styles.contentGrid}>
              <div className={styles.contentItem}>
                <FaSmile className={styles.contentIcon} />
                <h3>성격·유형 테스트</h3>
                <p>나도 몰랐던 내 성격과 유형을 가볍게 확인</p>
              </div>
              <div className={styles.contentItem}>
                <FaHeart className={styles.contentIcon} />
                <h3>연애·관계 테스트</h3>
                <p>친구나 연인과 공유하기 좋은 재미있는 결과</p>
              </div>
              <div className={styles.contentItem}>
                <FaCoffee className={styles.contentIcon} />
                <h3>잠깐의 여유</h3>
                <p>테스트 하나로 바쁜 하루를 환기하세요</p>
              </div>
            </div>
          </section>

          {/* 특징 */}
          <section className={styles.featuresSection}>
            <h2 className={styles.sectionTitle}>왜 우리 플랫폼인가요?</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}><FaClock /></div>
                <h3 className={styles.featureTitle}>빠른 테스트</h3>
                <p className={styles.featureText}>
                  길게 고민할 필요 없이, 몇 분이면 충분해요.
                </p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}><FaSmile /></div>
                <h3 className={styles.featureTitle}>가벼운 재미</h3>
                <p className={styles.featureText}>
                  하루의 작은 재미와 대화거리를 선물합니다.
                </p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}><FaUsers /></div>
                <h3 className={styles.featureTitle}>공유하기 좋음</h3>
                <p className={styles.featureText}>
                  친구, 연인과 결과를 공유해보세요.
                </p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}><FaRocket /></div>
                <h3 className={styles.featureTitle}>지속적 업데이트</h3>
                <p className={styles.featureText}>
                  새로운 테스트가 꾸준히 추가됩니다.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>지금, 테스트해보세요</h2>
              <p className={styles.ctaText}>
                가볍게 즐기고 친구들과 공유해보세요.
              </p>
              <Link href="/" className={styles.ctaButton}>
                심리테스트 시작하기
              </Link>
            </div>
          </section>

          {/* 푸터 */}
          <section className={styles.footerSection}>
            <p className={styles.footerText}>
              © 2025 루노 심리테스트 플랫폼. 모든 테스트는 <strong>가볍고 즐거운 경험</strong>을 위해 만들어졌습니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
