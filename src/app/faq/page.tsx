'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './FAQ.module.scss'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqData = [
    {
      question: "심리테스트는 얼마나 정확한가요?",
      answer: "저희 플랫폼의 심리테스트는 검증된 심리학 이론과 연구를 바탕으로 제작되었습니다. 하지만 이는 자기 이해를 돕는 도구이며, 전문적인 심리 상담을 대체할 수는 없습니다. 결과는 참고용으로 활용해 주세요."
    },
    {
      question: "개인정보는 어떻게 보호되나요?",
      answer: "모든 테스트는 익명으로 진행되며, 개인을 식별할 수 있는 정보는 수집하지 않습니다. 테스트 결과는 통계 목적으로만 사용되며, 개인정보보호법에 따라 안전하게 관리됩니다."
    },
    {
      question: "테스트 결과를 저장할 수 있나요?",
      answer: "현재는 별도의 회원가입 없이 익명으로 서비스를 제공하고 있어 결과 저장 기능은 없습니다. 테스트 완료 후 스크린샷을 찍거나 결과 페이지를 북마크해 두시면 됩니다."
    },
    {
      question: "모든 테스트가 무료인가요?",
      answer: "네, 저희 플랫폼의 모든 심리테스트는 완전 무료로 제공됩니다. 별도의 결제나 구독 없이 언제든지 자유롭게 이용하실 수 있습니다."
    },
    {
      question: "새로운 테스트는 언제 추가되나요?",
      answer: "정기적으로 새로운 테스트를 개발하여 추가하고 있습니다. 보통 월 1-2회 새로운 테스트가 업데이트되며, 홈페이지를 통해 새로운 테스트 소식을 확인하실 수 있습니다."
    },
    {
      question: "테스트 중간에 나가면 어떻게 되나요?",
      answer: "테스트를 중간에 나가시면 진행 상황이 저장되지 않습니다. 정확한 결과를 위해 한 번에 완료하시는 것을 권장합니다. 대부분의 테스트는 5-10분 내로 완료 가능합니다."
    },
    {
      question: "모바일에서도 테스트할 수 있나요?",
      answer: "네, 저희 플랫폼은 모바일 친화적으로 설계되어 스마트폰, 태블릿에서도 편리하게 이용하실 수 있습니다. 모든 기기에서 동일한 품질의 서비스를 제공합니다."
    },
    {
      question: "테스트 결과가 부정확하다고 느껴져요",
      answer: "테스트 결과는 현재 상태를 반영하는 것으로, 시간이 지나면서 변할 수 있습니다. 만약 결과가 맞지 않다고 느끼신다면, 솔직하게 답변했는지 다시 한번 확인해보시거나 시간을 두고 다시 테스트해보세요."
    },
    {
      question: "테스트 결과를 SNS에 공유할 수 있나요?",
      answer: "네, 대부분의 테스트 결과 페이지에서 SNS 공유 기능을 제공합니다. 카카오톡, 페이스북, 인스타그램 등으로 친구들과 결과를 공유하고 재미있게 비교해보세요."
    },
    {
      question: "문제가 생겼을 때 어디에 문의하나요?",
      answer: "기술적 문제나 서비스 관련 문의사항이 있으시면 '문의' 페이지를 통해 연락주세요. 영업일 기준 24시간 내로 답변드리도록 하겠습니다."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

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
              <li><Link href="/" className={styles.navLink}>홈</Link></li>
              <li><Link href="/about" className={styles.navLink}>소개</Link></li>
              <li><Link href="/faq" className={`${styles.navLink} ${styles.active}`}>FAQ</Link></li>
              <li><Link href="/contact" className={styles.navLink}>문의</Link></li>
              <li><Link href="/admin/login" className={styles.navLink}>관리자</Link></li>
            </ul>
          </nav>
        </div>
      </div>

      <div className={styles.heroSection}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>자주 묻는 질문</h1>
          <p className={styles.heroSubtitle}>
            궁금한 점이 있으시다면 아래에서 답변을 찾아보세요
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.faqList}>
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`${styles.faqItem} ${
                  openIndex === index ? styles.open : ''
                }`}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFAQ(index)}
                >
                  <span className={styles.questionText}>{faq.question}</span>
                  <span className={styles.toggleIcon}>
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.contactSection}>
            <div className={styles.contactCard}>
              <h2 className={styles.contactTitle}>찾으시는 답변이 없나요?</h2>
              <p className={styles.contactText}>
                직접 문의하시면 빠르게 도와드리겠습니다
              </p>
              <Link href="/contact" className={styles.contactButton}>
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}