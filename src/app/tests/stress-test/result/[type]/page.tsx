'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StressResult } from '@/data/stress-test'
import styles from './StressResult.module.scss'

interface Props {
  params: {
    type: 'low' | 'medium' | 'high'
  }
}

export default function StressResultPage({ params }: Props) {
  const [result, setResult] = useState<StressResult | null>(null)

  useEffect(() => {
    // In a real app, you might get this from localStorage, URL params, or API
    // For now, we'll create mock results based on the type
    const mockResults: Record<string, StressResult> = {
      low: {
        type: 'low',
        title: '낮은 스트레스 수준',
        description: '현재 스트레스 수준이 비교적 낮은 상태입니다. 전반적으로 안정적인 정신 상태를 유지하고 있습니다.',
        advice: '현재 상태를 잘 유지하며, 규칙적인 생활 패턴과 건강한 취미활동을 지속하세요. 예방적 차원에서 스트레스 관리법을 미리 익혀두는 것도 좋습니다.',
        score: 8,
        maxScore: 30
      },
      medium: {
        type: 'medium',
        title: '보통 스트레스 수준',
        description: '일상적인 스트레스를 경험하고 있는 상태입니다. 적절한 관리가 필요한 시점입니다.',
        advice: '충분한 휴식과 수면을 취하고, 규칙적인 운동을 통해 스트레스를 해소하세요. 취미활동이나 명상, 친구들과의 만남 등을 통해 긍정적인 에너지를 충전하는 것이 좋습니다.',
        score: 15,
        maxScore: 30
      },
      high: {
        type: 'high',
        title: '높은 스트레스 수준',
        description: '현재 높은 수준의 스트레스를 경험하고 있습니다. 적극적인 관리와 도움이 필요한 상태입니다.',
        advice: '전문가의 도움을 받는 것을 고려해보세요. 일상생활에서 스트레스 요인을 파악하고 줄여나가며, 충분한 휴식과 전문적인 스트레스 관리 프로그램 참여를 권장합니다.',
        score: 23,
        maxScore: 30
      }
    }

    setResult(mockResults[params.type])
  }, [params.type])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '스트레스 지수 테스트 결과',
          text: `나의 스트레스 지수는 "${result?.title}"입니다. 여러분도 테스트해보세요!`,
          url: window.location.origin
        })
      } catch (error) {
        console.log('공유 실패:', error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const url = window.location.origin
      const text = `나의 스트레스 지수는 "${result?.title}"입니다. 여러분도 테스트해보세요! ${url}`
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
        alert('링크가 클립보드에 복사되었습니다!')
      } else {
        alert('공유 기능이 지원되지 않는 브라우저입니다.')
      }
    }
  }

  if (!result) {
    return <div className={styles.loading}>결과를 불러오는 중...</div>
  }

  const percentage = Math.round((result.score / result.maxScore) * 100)

  return (
    <div className={`${styles.container} ${styles[result.type]}`}>
      <div className={styles.header}>
        <Link href="/" className={styles.homeLink}>
          ← 홈으로 돌아가기
        </Link>
      </div>
      
      <div className={styles.content}>
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <div className={styles.icon}>
              {result.type === 'low' && '😊'}
              {result.type === 'medium' && '😐'}
              {result.type === 'high' && '😰'}
            </div>
            <h1 className={styles.resultTitle}>{result.title}</h1>
            <div className={styles.scoreContainer}>
              <div className={styles.scoreText}>
                {result.score} / {result.maxScore}점
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className={styles.percentage}>
                {percentage}%
              </div>
            </div>
          </div>
          
          <div className={styles.resultContent}>
            <section className={styles.description}>
              <h2>결과 분석</h2>
              <p>{result.description}</p>
            </section>
            
            <section className={styles.advice}>
              <h2>관리 방법</h2>
              <p>{result.advice}</p>
            </section>
            
            <section className={styles.recommendations}>
              <h2>추천 활동</h2>
              <div className={styles.activities}>
                {result.type === 'low' && (
                  <>
                    <div className={styles.activity}>🧘‍♀️ 명상이나 요가</div>
                    <div className={styles.activity}>📚 독서나 새로운 취미</div>
                    <div className={styles.activity}>🌿 자연 속 산책</div>
                  </>
                )}
                {result.type === 'medium' && (
                  <>
                    <div className={styles.activity}>🏃‍♂️ 규칙적인 운동</div>
                    <div className={styles.activity}>😴 충분한 수면</div>
                    <div className={styles.activity}>👥 친구들과의 만남</div>
                  </>
                )}
                {result.type === 'high' && (
                  <>
                    <div className={styles.activity}>🩺 전문가 상담</div>
                    <div className={styles.activity}>💤 휴식과 수면</div>
                    <div className={styles.activity}>🎵 음악이나 아로마 테라피</div>
                  </>
                )}
              </div>
            </section>
          </div>
          
          <div className={styles.actions}>
            <button 
              className={styles.shareButton}
              onClick={handleShare}
            >
              결과 공유하기
            </button>
            <Link href="/tests/stress-test" className={styles.retestButton}>
              다시 테스트하기
            </Link>
            <Link href="/" className={styles.homeButton}>
              다른 테스트 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}