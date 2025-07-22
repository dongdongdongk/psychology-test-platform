import Header from '@/components/common/Header'
import Link from 'next/link'
import styles from './PageLoader.module.scss'

interface PageLoaderProps {
  type?: 'loading' | 'error' | 'not-found' | 'inactive'
  title?: string
  message?: string
  showHomeButton?: boolean
  customAction?: React.ReactNode
  showHeader?: boolean
}

export default function PageLoader({ 
  type = 'loading',
  title,
  message,
  showHomeButton = true,
  customAction,
  showHeader = true
}: PageLoaderProps) {
  const getContent = () => {
    switch (type) {
      case 'loading':
        return {
          title: title || '불러오는 중...',
          message: message || '잠시만 기다려주세요.',
          icon: <div className={styles.spinner}></div>
        }
      case 'error':
        return {
          title: title || '오류가 발생했습니다',
          message: message || '페이지를 불러오는데 실패했습니다.',
          icon: <div className={styles.errorIcon}>⚠️</div>
        }
      case 'not-found':
        return {
          title: title || '페이지를 찾을 수 없습니다',
          message: message || '요청하신 페이지가 존재하지 않습니다.',
          icon: <div className={styles.notFoundIcon}>🔍</div>
        }
      case 'inactive':
        return {
          title: title || '서비스 준비중',
          message: message || '이 서비스는 현재 개발 중입니다. 곧 만나보실 수 있어요!',
          icon: <div className={styles.inactiveIcon}>🔧</div>
        }
      default:
        return {
          title: '불러오는 중...',
          message: '잠시만 기다려주세요.',
          icon: <div className={styles.spinner}></div>
        }
    }
  }

  const content = getContent()

  return (
    <div className={styles.pageContainer}>
      {showHeader && <Header />}
      <div className={styles.contentContainer}>
        <div className={styles.messageBox}>
          <div className={styles.iconContainer}>
            {content.icon}
          </div>
          
          <div className={styles.textContainer}>
            <h1 className={styles.title}>{content.title}</h1>
            <p className={styles.message}>{content.message}</p>
          </div>
          
          {(showHomeButton || customAction) && (
            <div className={styles.actionContainer}>
              {customAction || (
                <Link href="/" className="theme-button">
                  홈으로 돌아가기
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}