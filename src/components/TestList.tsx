'use client'

import { useState, useEffect } from 'react'
import { Test } from '@/types'
import axios from 'axios'

export default function TestList() {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (loading) {
    return <div className="loading">테스트 목록을 불러오는 중...</div>
  }

  if (error) {
    return <div className="text-center" style={{ color: '#dc3545' }}>{error}</div>
  }

  if (tests.length === 0) {
    return (
      <div className="text-center">
        <h2 style={{ color: '#666', marginBottom: '16px' }}>
          아직 등록된 테스트가 없습니다
        </h2>
        <p style={{ color: '#999' }}>
          관리자 페이지에서 테스트를 등록해주세요
        </p>
      </div>
    )
  }

  return (
    <section>
      <h2 style={{ fontSize: '32px', marginBottom: '32px', textAlign: 'center' }}>
        심리테스트 목록
      </h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        {tests.map((test) => (
          <div key={test.id} className="card">
            {test.thumbnailUrl && (
              <img 
                src={test.thumbnailUrl} 
                alt={test.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  marginBottom: '16px'
                }}
              />
            )}
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
              {test.title}
            </h3>
            {test.description && (
              <p style={{ color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
                {test.description}
              </p>
            )}
            <a 
              href={test.testUrl} 
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              테스트 시작하기
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}