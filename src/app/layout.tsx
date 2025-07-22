import type { Metadata } from 'next'
import './globals.scss'

export const metadata: Metadata = {
  title: '심리테스트 플랫폼',
  description: '다양한 심리테스트를 통해 자신을 알아보세요',
  keywords: ['심리테스트', '성격테스트', '심리분석', '자기분석'],
  authors: [{ name: '심리테스트 플랫폼' }],
  openGraph: {
    title: '심리테스트 플랫폼',
    description: '다양한 심리테스트를 통해 자신을 알아보세요',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '심리테스트 플랫폼',
    description: '다양한 심리테스트를 통해 자신을 알아보세요',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyQXcy2VVI6gLl0t" 
          crossOrigin="anonymous"></script>
      </head>
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}