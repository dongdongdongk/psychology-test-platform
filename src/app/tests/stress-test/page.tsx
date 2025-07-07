import Link from 'next/link'
import styles from './StressTest.module.scss'

export default function StressTestIntro() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.homeLink}>
          ← 홈으로 돌아가기
        </Link>
      </div>
      
      <div className={styles.content}>
        <div className={styles.heroSection}>
          <h1 className={styles.title}>스트레스 지수 테스트</h1>
          <p className={styles.subtitle}>
            나의 현재 스트레스 수준을 확인해보세요
          </p>
        </div>
        
        <div className={styles.description}>
          <h2>테스트 소개</h2>
          <p>
            이 테스트는 최근 일주일간의 경험을 바탕으로 현재 스트레스 수준을 측정합니다.
            총 10개의 질문에 솔직하게 답변해주세요.
          </p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>🎯 정확한 측정</h3>
              <p>심리학적 기준에 따른 스트레스 측정</p>
            </div>
            <div className={styles.feature}>
              <h3>⚡ 빠른 진단</h3>
              <p>단 10개 질문으로 간편하게 측정</p>
            </div>
            <div className={styles.feature}>
              <h3>💡 맞춤 조언</h3>
              <p>결과에 따른 스트레스 관리법 제공</p>
            </div>
          </div>
        </div>
        
        <div className={styles.testInfo}>
          <h2>테스트 정보</h2>
          <ul>
            <li>소요 시간: 약 3-5분</li>
            <li>질문 수: 10개</li>
            <li>결과 유형: 3가지 (낮음/보통/높음)</li>
            <li>결과 공유: SNS 공유 가능</li>
          </ul>
        </div>
        
        <div className={styles.startSection}>
          <Link href="/tests/stress-test/quiz" className={styles.startButton}>
            테스트 시작하기
          </Link>
          <p className={styles.privacy}>
            * 모든 답변은 익명으로 처리되며, 개인정보는 수집하지 않습니다.
          </p>
        </div>
      </div>
    </div>
  )
}