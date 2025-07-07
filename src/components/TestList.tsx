'use client'

import { useState, useEffect, useMemo } from 'react'
import { Test } from '@/types'
import axios from 'axios'
import styles from './TestList.module.scss'

export default function TestList() {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      const response = await axios.get('/api/tests')
      setTests(response.data)
    } catch (err) {
      setError('테스트 목록을 불러오는데 실패했습니다.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 카테고리 목록 추출
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(tests.map(test => test.category)))
    return ['전체', ...uniqueCategories]
  }, [tests])

  // 필터링된 테스트 목록
  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           test.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === '전체' || test.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [tests, searchTerm, selectedCategory])

  const handleTestClick = (test: Test) => {
    if (test.isActive) {
      window.location.href = test.testUrl
    } else {
      alert('이 테스트는 현재 개발 중입니다. 곧 만나보실 수 있어요!')
    }
  }

  if (loading) {
    return <div className={styles.loading}>테스트 목록을 불러오는 중...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  if (tests.length === 0) {
    return (
      <div className={styles.noResults}>
        <div className={styles.icon}>📝</div>
        <h3>아직 등록된 테스트가 없습니다</h3>
        <p>관리자 페이지에서 테스트를 등록해주세요</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* 검색 섹션 */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="테스트 제목이나 설명으로 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className={styles.filterSection}>
        <div className={styles.categoryFilters}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`${styles.categoryButton} ${
                selectedCategory === category ? styles.active : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 검색 결과 정보 */}
      <div className={styles.resultsInfo}>
        {searchTerm || selectedCategory !== '전체' 
          ? `${filteredTests.length}개의 테스트를 찾았습니다`
          : `총 ${tests.length}개의 테스트가 있습니다`
        }
      </div>

      {/* 테스트 카드 그리드 */}
      {filteredTests.length === 0 ? (
        <div className={styles.noResults}>
          <div className={styles.icon}>🔍</div>
          <h3>검색 결과가 없습니다</h3>
          <p>다른 검색어나 카테고리를 시도해보세요</p>
        </div>
      ) : (
        <div className={styles.testsGrid}>
          {filteredTests.map((test) => (
            <div key={test.id} className={styles.testCard}>
              <div className={styles.cardImage}>
                <img 
                  src={test.thumbnailUrl || '/placeholder-image.jpg'} 
                  alt={test.title}
                />
                <div className={styles.categoryBadge}>
                  {test.category}
                </div>
                <div className={`${styles.statusBadge} ${test.isActive ? styles.active : styles.inactive}`}>
                  {test.isActive ? '이용가능' : '개발중'}
                </div>
              </div>
              
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>
                  {test.title}
                </h3>
                {test.description && (
                  <p className={styles.cardDescription}>
                    {test.description}
                  </p>
                )}
              </div>
              
              <div className={styles.cardFooter}>
                <button
                  onClick={() => handleTestClick(test)}
                  className={styles.startButton}
                  disabled={!test.isActive}
                >
                  {test.isActive ? '테스트 시작하기' : '개발중'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}