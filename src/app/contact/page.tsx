'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './Contact.module.scss'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
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
              <li><Link href="/faq" className={styles.navLink}>FAQ</Link></li>
              <li><Link href="/contact" className={`${styles.navLink} ${styles.active}`}>문의</Link></li>
              <li><Link href="/admin/login" className={styles.navLink}>관리자</Link></li>
            </ul>
          </nav>
        </div>
      </div>

      <div className={styles.heroSection}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>문의하기</h1>
          <p className={styles.heroSubtitle}>
            궁금한 점이 있으시면 언제든지 연락주세요
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.contactLayout}>
            <div className={styles.contactInfo}>
              <h2 className={styles.infoTitle}>연락처 정보</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>📧</div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoLabel}>이메일</h3>
                    <p className={styles.infoValue}>support@psychtest.com</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>⏰</div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoLabel}>응답 시간</h3>
                    <p className={styles.infoValue}>영업일 기준 24시간 내</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>💬</div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoLabel}>문의 유형</h3>
                    <p className={styles.infoValue}>기술 지원, 서비스 문의, 제안사항</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.contactForm}>
              <h2 className={styles.formTitle}>메시지 보내기</h2>
              
              {submitStatus === 'success' && (
                <div className={styles.successMessage}>
                  <div className={styles.messageIcon}>✅</div>
                  <div>
                    <h3>문의가 성공적으로 전송되었습니다!</h3>
                    <p>영업일 기준 24시간 내로 답변드리겠습니다.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className={styles.errorMessage}>
                  <div className={styles.messageIcon}>❌</div>
                  <div>
                    <h3>문의 전송에 실패했습니다</h3>
                    <p>잠시 후 다시 시도해주세요.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>이름 *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="성함을 입력해주세요"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>이메일 *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="이메일 주소를 입력해주세요"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.label}>문의 유형 *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={styles.select}
                  >
                    <option value="">문의 유형을 선택해주세요</option>
                    <option value="기술 지원">기술 지원</option>
                    <option value="서비스 문의">서비스 문의</option>
                    <option value="제안사항">제안사항</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>메시지 *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className={styles.textarea}
                    placeholder="문의 내용을 자세히 적어주세요"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? '전송 중...' : '메시지 보내기'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}