'use client'

import { useTestCreationStore } from '@/store/testCreationStore'
import styles from './Step1BasicSettings.module.scss'

export default function Step1BasicSettings() {
  const {
    title,
    description,
    category,
    thumbnailUrl,
    detailImageUrl,
    questionCount,
    optionCount,
    styleTheme,
    setBasicInfo
  } = useTestCreationStore()

  const handleChange = (field: string, value: string | number) => {
    setBasicInfo({ [field]: value })
  }

  const themes = [
    { value: 'modern', label: 'Modern - 모던하고 세련된 스타일' },
    { value: 'cute', label: 'Cute - 귀엽고 사랑스러운 스타일' },
    { value: 'dark', label: 'Dark - 다크하고 시크한 스타일' },
    { value: 'vibrant', label: 'Vibrant - 밝고 활기찬 스타일' },
    { value: 'minimal', label: 'Minimal - 심플하고 미니멀한 스타일' },
    { value: 'retro', label: 'Retro - 복고풍 스타일' }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>1단계: 기본 설정</h2>
        <p>테스트의 기본 정보와 구조를 설정해주세요</p>
      </div>

      <div className={styles.form}>
        <div className={styles.section}>
          <h3>테스트 기본 정보</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              테스트 제목 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="예: 나의 성격 유형 테스트"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              테스트 설명 *
            </label>
            <textarea
              value={description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="테스트에 대한 간단한 설명을 입력하세요"
              className={styles.textarea}
              rows={4}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              카테고리 *
            </label>
            <select
              value={category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={styles.select}
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
          </div>
        </div>

        <div className={styles.section}>
          <h3>이미지 설정</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              썸네일 이미지 URL
            </label>
            <input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
              placeholder="https://example.com/thumbnail.jpg"
              className={styles.input}
            />
            <p className={styles.help}>테스트 목록에서 표시될 썸네일 이미지</p>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              테스트 상세 이미지 URL
            </label>
            <input
              type="url"
              value={detailImageUrl}
              onChange={(e) => handleChange('detailImageUrl', e.target.value)}
              placeholder="https://example.com/detail.jpg"
              className={styles.input}
            />
            <p className={styles.help}>테스트 시작 페이지에서 표시될 상세 이미지</p>
          </div>
        </div>

        <div className={styles.section}>
          <h3>테스트 구조 설정</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                문제 개수 *
              </label>
              <input
                type="number"
                value={questionCount}
                onChange={(e) => handleChange('questionCount', parseInt(e.target.value))}
                min="1"
                max="50"
                className={styles.input}
                required
              />
              <p className={styles.help}>생성할 문제의 개수 (1-50개)</p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                선택지 개수 *
              </label>
              <input
                type="number"
                value={optionCount}
                onChange={(e) => handleChange('optionCount', parseInt(e.target.value))}
                min="2"
                max="10"
                className={styles.input}
                required
              />
              <p className={styles.help}>각 문제당 선택지 개수 (2-10개)</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>테마 설정</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              테마 선택 *
            </label>
            <select
              value={styleTheme}
              onChange={(e) => handleChange('styleTheme', e.target.value)}
              className={styles.select}
              required
            >
              {themes.map(theme => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </select>
            <p className={styles.help}>테스트 페이지에 적용될 디자인 테마</p>
          </div>
        </div>

        <div className={styles.summary}>
          <h3>설정 요약</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>문제 개수:</span>
              <span className={styles.summaryValue}>{questionCount}개</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>선택지 개수:</span>
              <span className={styles.summaryValue}>{optionCount}개</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>총 선택지:</span>
              <span className={styles.summaryValue}>{questionCount * optionCount}개</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>테마:</span>
              <span className={styles.summaryValue}>{styleTheme}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}