import { Test } from '@/types'

interface StructuredDataProps {
  tests: Test[]
}

export default function StructuredData({ tests }: StructuredDataProps) {
  // 웹사이트 정보
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "루노 심리테스트",
    "description": "1분이면 충분해요. 무료 심리테스트로 하루에 소소한 의미를 더해보세요.",
    "url": "https://play.roono.net",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://play.roono.net/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "루노 심리테스트",
      "url": "https://play.roono.net"
    }
  }

  // 조직 정보
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "루노 심리테스트",
    "description": "무료 심리테스트 플랫폼",
    "url": "https://play.roono.net",
    "logo": {
      "@type": "ImageObject",
      "url": "https://play.roono.net/logo.png"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@roono.net"
    }
  }

  // 테스트 컬렉션 정보
  const collectionData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "루노 심리테스트 모음",
    "description": "MBTI, 연애, 성격, 적성 등 다양한 무료 심리테스트",
    "url": "https://play.roono.net",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": tests.slice(0, 10).map((test, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "WebPage",
          "name": test.title,
          "description": test.description || test.title,
          "url": `https://play.roono.net/tests/${test.id}`,
          "image": test.thumbnailUrl,
          "mainEntityOfPage": {
            "@type": "Quiz",
            "name": test.title,
            "description": test.description || test.title,
            "educationalLevel": "beginner",
            "assesses": "personality",
            "timeRequired": "PT1M"
          }
        }
      }))
    }
  }

  // 빵부스러기 정보
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": "https://play.roono.net"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "심리테스트",
        "item": "https://play.roono.net"
      }
    ]
  }

  // FAQ 정보
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "심리테스트는 무료인가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "네, 루노의 모든 심리테스트는 무료로 이용하실 수 있습니다."
        }
      },
      {
        "@type": "Question",
        "name": "테스트 결과는 정확한가요?",
        "@acceptedAnswer": {
          "@type": "Answer",
          "text": "저희 테스트는 심리학적 이론을 바탕으로 제작되었지만, 재미와 자기 성찰을 위한 목적입니다. 전문적인 심리 상담이 필요하시다면 전문가와 상담하시기 바랍니다."
        }
      },
      {
        "@type": "Question",
        "name": "얼마나 오래 걸리나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "대부분의 테스트는 1-3분 내에 완료할 수 있도록 설계되었습니다."
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </>
  )
}