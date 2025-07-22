'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import PageLoader from '@/components/common/PageLoader'
import { Test } from '@/types'
import styles from './AdminTests.module.scss'

interface TestWithCount extends Test {
  _count: {
    responses: number
  }
  completionCount: number
  shareCount: number
}

export default function AdminTestsPage() {
  const [tests, setTests] = useState<TestWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      const response = await axios.get('/api/admin/tests')
      setTests(response.data)
    } catch (error: any) {
      if (error.response?.status === 401) {
        window.location.href = '/admin/login'
        return
      }
      setError('테스트 목록을 불러오는데 실패했습니다.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTestStatus = async (testId: string, currentStatus: boolean) => {
    try {
      const test = tests.find(t => t.id === testId)
      if (!test) return

      await axios.put(`/api/admin/tests/${testId}`, {
        ...test,
        isActive: !currentStatus
      })

      setTests(prev => prev.map(t => 
        t.id === testId ? { ...t, isActive: !currentStatus } : t
      ))
    } catch (error) {
      alert('상태 변경에 실패했습니다.')
      console.error(error)
    }
  }

  const deleteTest = async (testId: string) => {
    const test = tests.find(t => t.id === testId)
    if (!test) return

    const hasResponses = test._count.responses > 0
    let confirmMessage = '정말로 이 테스트를 삭제하시겠습니까?'
    
    if (hasResponses) {
      confirmMessage = `이 테스트에는 ${test._count.responses}개의 응답이 있습니다.\n\n테스트와 모든 응답 데이터가 삭제됩니다.\n\n정말로 삭제하시겠습니까?`
    }

    if (!confirm(confirmMessage)) {
      return
    }

    try {
      await axios.delete(`/api/admin/tests/${testId}`)
      setTests(prev => prev.filter(t => t.id !== testId))
      alert('테스트가 삭제되었습니다.')
    } catch (error: any) {
      alert(error.response?.data?.error || '삭제에 실패했습니다.')
      console.error(error)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post('/api/admin/auth/logout')
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return <PageLoader type="loading" message="테스트 목록을 불러오는 중..." showHeader={false} />
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.title}>
            <h1>테스트 관리</h1>
            <p>심리테스트 플랫폼 관리자 페이지</p>
          </div>
          <div className={styles.actions}>
            <Link href="/admin/tests/create" className={styles.addButton}>
              새 테스트 추가
            </Link>
            <button onClick={handleLogout} className={styles.logoutButton}>
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {tests.length === 0 ? (
          <div className={styles.empty}>
            <h2>등록된 테스트가 없습니다</h2>
            <p>새로운 테스트를 추가해보세요.</p>
            <Link href="/admin/tests/create" className={styles.addButton}>
              첫 번째 테스트 추가하기
            </Link>
          </div>
        ) : (
          <div className={styles.testsGrid}>
            {tests.map((test) => (
              <div key={test.id} className={styles.testCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.statusBadge}>
                    <span className={`${styles.status} ${test.isActive ? styles.active : styles.inactive}`}>
                      {test.isActive ? '활성' : '비활성'}
                    </span>
                  </div>
                  <div className={styles.cardActions}>
                    <Link
                      href={`/admin/tests/${test.id}/edit`}
                      className={styles.editButton}
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => toggleTestStatus(test.id, test.isActive)}
                      className={styles.toggleButton}
                    >
                      {test.isActive ? '비활성화' : '활성화'}
                    </button>
                    <button
                      onClick={() => deleteTest(test.id)}
                      className={styles.deleteButton}
                      title={test._count.responses > 0 ? `${test._count.responses}개의 응답이 백업 후 삭제됩니다` : '테스트를 삭제합니다'}
                    >
                      삭제
                    </button>
                  </div>
                </div>

                {test.thumbnailUrl && (
                  <img
                    src={test.thumbnailUrl}
                    alt={test.title}
                    className={styles.thumbnail}
                  />
                )}

                <div className={styles.cardContent}>
                  <h3 className={styles.testTitle}>{test.title}</h3>
                  <p className={styles.testDescription}>
                    {test.description || '설명이 없습니다.'}
                  </p>
                  
                  <div className={styles.testInfo}>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>ID:</span>
                      <span className={styles.value}>{test.id}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>테마:</span>
                      <span className={styles.value}>{test.styleTheme || 'modern'}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>응답 수:</span>
                      <span className={styles.value}>{test._count.responses}개</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>완료 수:</span>
                      <span className={styles.value}>{test.completionCount || 0}명</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>공유 수:</span>
                      <span className={styles.value}>{test.shareCount || 0}회</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>생성일:</span>
                      <span className={styles.value}>
                        {new Date(test.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <a
                    href={`/tests/${test.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.viewButton}
                  >
                    테스트 보기
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}