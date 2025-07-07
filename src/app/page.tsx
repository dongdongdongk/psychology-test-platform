import { Suspense } from 'react'
import TestList from '@/components/TestList'

export default function HomePage() {
  return (
    <main>
      <div className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo">
              심리테스트 플랫폼
            </div>
            <ul className="nav-links">
              <li>
                <a href="/">홈</a>
              </li>
              <li>
                <a href="/admin/login">관리자</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      
      <div className="main-content">
        <div className="container">
          <section className="hero text-center">
            <h1 style={{ fontSize: '48px', marginBottom: '16px', color: '#333' }}>
              심리테스트 플랫폼
            </h1>
            <p style={{ fontSize: '20px', color: '#666', marginBottom: '40px' }}>
              다양한 심리테스트를 통해 자신을 더 깊이 이해해보세요
            </p>
          </section>
          
          <Suspense fallback={<div className="loading">테스트 목록을 불러오는 중...</div>}>
            <TestList />
          </Suspense>
        </div>
      </div>
    </main>
  )
}