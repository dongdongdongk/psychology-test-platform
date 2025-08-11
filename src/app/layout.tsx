import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import KakaoScript from '@/components/common/KakaoScript'
import './globals.scss'

export const metadata: Metadata = {
  metadataBase: new URL('https://play.roono.net'),
  title: {
    default: '루노 심리테스트 - 1분 만에 나를 알아보는 무료 심리테스트',
    template: '%s | 루노 심리테스트'
  },
  description: '1분이면 충분해요. 무료 심리테스트로 하루에 소소한 의미를 더해보세요. MBTI, 연애, 성격, 적성 등 다양한 심리테스트를 만나보세요.',
  keywords: ['심리테스트', '무료심리테스트', 'MBTI', '성격테스트', '연애테스트', '적성테스트', '루노', '심리분석', '성격분석', '자기이해'],
  authors: [{ name: '루노 심리테스트', url: 'https://play.roono.net' }],
  creator: '루노 심리테스트',
  publisher: '루노 심리테스트',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://play.roono.net',
    siteName: '루노 심리테스트',
    title: '루노 심리테스트 - 1분 만에 나를 알아보는 무료 심리테스트',
    description: '1분이면 충분해요. 무료 심리테스트로 하루에 소소한 의미를 더해보세요.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@roono_test',
    creator: '@roono_test',
    title: '루노 심리테스트 - 1분 만에 나를 알아보는 무료 심리테스트',
    description: '1분이면 충분해요. 무료 심리테스트로 하루에 소소한 의미를 더해보세요.',
  },
  category: '심리테스트',
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f7bcb7',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        {/* 카카오 JavaScript SDK */}
        <KakaoScript />
        <div id="root">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}