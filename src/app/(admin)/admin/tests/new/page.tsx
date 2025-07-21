'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import styles from './NewTest.module.scss'

export default function NewTestPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '일반',
    thumbnailUrl: '',
    detailImageUrl: '',
    styleTheme: 'modern',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            <label htmlFor="category" className={styles.label}>
              카테고리 *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="일반">일반</option>
              <option value="성격분석">성격분석</option>
              <option value="멘탈헬스">멘탈헬스</option>
              <option value="연애">연애</option>
              <option value="진로">진로</option>
              <option value="취미">취미</option>
              <option value="라이프스타일">라이프스타일</option>
            </select>
            <p className={styles.help}>
              테스트의 주제에 맞는 카테고리를 선택하세요.
            </p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="styleTheme" className={styles.label}>
              테마 스타일 *
            </label>
            <select
              id="styleTheme"
              name="styleTheme"
              value={formData.styleTheme}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="modern">Modern - 모던하고 세련된 스타일</option>
              <option value="cute">Cute - 귀엽고 사랑스러운 스타일</option>
              <option value="dark">Dark - 다크하고 시크한 스타일</option>
              <option value="vibrant">Vibrant - 밝고 활기찬 스타일</option>
              <option value="minimal">Minimal - 심플하고 미니멀한 스타일</option>
              <option value="retro">Retro - 복고풍 스타일</option>
            </select>
            <p className={styles.help}>
              테스트 페이지에 적용될 디자인 테마를 선택하세요.
            </p>
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
              placeholder="https://example.com/thumbnail.jpg"
            />
            <p className={styles.help}>
              이미지 URL을 입력하면 테스트 목록에서 썸네일로 표시됩니다.
            </p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="detailImageUrl" className={styles.label}>
              테스트 상세 이미지 URL
            </label>
            <input
              type="url"
              id="detailImageUrl"
              name="detailImageUrl"
              value={formData.detailImageUrl}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://example.com/detail.jpg"
            />
            <p className={styles.help}>
              테스트 시작 페이지에서 표시될 상세 이미지입니다.
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