'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import styles from './NewTest.module.scss'

export default function NewTestPage() {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    thumbnailUrl: '',
    testUrl: '',
    isActive: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await axios.post('/api/admin/tests', formData)
      router.push('/admin/tests')
    } catch (error: any) {
      if (error.response?.status === 401) {
        window.location.href = '/admin/login'
        return
      }
      setError(error.response?.data?.error || '테스트 생성에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.title}>
            <h1>새 테스트 추가</h1>
            <p>새로운 심리테스트를 플랫폼에 추가합니다</p>
          </div>
          <Link href="/admin/tests" className={styles.backButton}>
            ← 목록으로 돌아가기
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="id" className={styles.label}>
              테스트 ID *
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className={styles.input}
              placeholder="예: personality-test (URL에 사용됩니다)"
              required
            />
            <p className={styles.help}>
              영문, 숫자, 하이픈(-)만 사용 가능합니다. URL 경로에 사용됩니다.
            </p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              테스트 제목 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              placeholder="예: 성격 유형 테스트"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              테스트 설명
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="테스트에 대한 간단한 설명을 입력하세요"
              rows={4}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="thumbnailUrl" className={styles.label}>
              썸네일 이미지 URL
            </label>
            <input
              type="url"
              id="thumbnailUrl"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://example.com/image.jpg"
            />
            <p className={styles.help}>
              이미지 URL을 입력하면 테스트 목록에서 썸네일로 표시됩니다.
            </p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="testUrl" className={styles.label}>
              테스트 URL *
            </label>
            <input
              type="text"
              id="testUrl"
              name="testUrl"
              value={formData.testUrl}
              onChange={handleChange}
              className={styles.input}
              placeholder="예: /tests/personality-test"
              required
            />
            <p className={styles.help}>
              테스트 페이지의 경로입니다. /tests/로 시작해야 합니다.
            </p>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className={styles.checkbox}
              />
              <label htmlFor="isActive" className={styles.checkboxLabel}>
                테스트 활성화 (사용자에게 노출)
              </label>
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.cancelButton}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? '생성 중...' : '테스트 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}