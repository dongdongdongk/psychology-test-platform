심리테스트 플랫폼 기획서

1. 프로젝트 개요

1.1 서비스 소개

서비스명: 심리테스트 플랫폼
목적: 다양한 심리테스트를 제공하고 사용자 데이터를 수집하는 웹 플랫폼
타겟: 일반 사용자 및 관리자
비즈니스 모델: 사용자 응답 데이터 수집 및 기업 제공

1.2 주요 기능

심리테스트 목록 조회
개별 테스트 페이지 (커스텀 디자인)
SNS 공유 기능
관리자 테스트 메타데이터 관리 시스템
SEO 최적화된 콘텐츠 제공 중요

1.3 테스트 등록 방식

개발자 직접 구현: 각 테스트마다 완전히 다른 디자인의 Next.js 페이지 구현
관리자 메타데이터 관리: 썸네일, URL, 제목, 설명만 관리
배포 기반 등록: 새 테스트 페이지 개발 후 전체 사이트 재배포


2. 기술 스택
2.1 프론트엔드

Framework: Next.js 14 (App Router)
언어: TypeScript
스타일링: SCSS + CSS Modules
상태관리: Zustand (간단한 상태 관리)
HTTP 클라이언트: Axios

2.2 백엔드

API: Next.js API Routes
데이터베이스: PostgreSQL (Supabase)
ORM: Prisma
인증: NextAuth.js
파일 업로드: Cloudinary

2.3 배포 및 호스팅

배포: Vercel (자동 배포)
데이터베이스: Supabase
이미지 스토리지: Cloudinary


3. 프로젝트 구조 ( 테스트용 심리테스트 하나만 만들어줘 간단하게 테스트 가능하게 10문항 결과 페이지 2개 정도로 된 ( 지금 mbti, bigfive, enneagram 만들지 마 ) )

src/
├── app/
│   ├── (admin)/
│   │   └── admin/
│   │       ├── login/
│   │       └── tests/
│   │           ├── page.tsx           # 테스트 목록 관리
│   │           └── new/
│   │               └── page.tsx       # 테스트 메타데이터 등록
│   ├── tests/
│   │   ├── mbti/                      # MBTI 테스트 (커스텀 페이지) <- 예시 만들지말도록
│   │   │   ├── page.tsx
│   │   │   ├── quiz/
│   │   │   │   └── page.tsx
│   │   │   └── result/
│   │   │       └── [type]/
│   │   │           └── page.tsx
│   │   ├── big-five/                  # Big Five 테스트 (다른 디자인) <-  예시 만들지말도록
│   │   │   ├── page.tsx
│   │   │   ├── quiz/
│   │   │   └── result/
│   │   └── enneagram/                 # 에니어그램 테스트 <-  예시 만들지말도록
│   │       ├── page.tsx
│   │       ├── quiz/
│   │       └── result/
│   ├── api/
│   │   ├── admin/
│   │   └── auth/
│   ├── globals.scss
│   └── layout.tsx
├── components/
│   ├── common/
│   ├── admin/
│   └── ui/
├── hooks/
├── lib/
├── store/
├── types/
└── utils/


4. 데이터베이스 설계

Tests (테스트 메타데이터만 관리)

CREATE TABLE tests (
  id VARCHAR(50) PRIMARY KEY,          -- "mbti", "big-five" 등
  title VARCHAR(255) NOT NULL,         -- "MBTI 성격유형 테스트"
  description TEXT,                    -- 테스트 설명
  thumbnail_url VARCHAR(500),          -- 썸네일 이미지 URL
  test_url VARCHAR(500) NOT NULL,      -- "/tests/mbti"
  is_active BOOLEAN DEFAULT true,      -- 활성화 여부
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


Admins (관리자)


CREATE TABLE admins (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);


UserResponses (사용자 응답 - 각 테스트별로 수집)

CREATE TABLE user_responses (
  id VARCHAR(50) PRIMARY KEY,
  test_id VARCHAR(50) REFERENCES tests(id),  -- "mbti", "big-five" 등
  response_data JSONB NOT NULL,               -- 테스트별 응답 데이터
  result_data JSONB,                         -- 테스트별 결과 데이터
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);


5. 페이지별 상세 기능


5.1 사용자 페이지
메인 페이지 (/)

전체 테스트 목록 (PSY01)

데이터베이스에서 활성화된 테스트 메타데이터 조회
썸네일, 제목, 설명 카드 형태로 표시
클릭 시 해당 테스트 URL로 이동



개별 테스트 소개 페이지 (/tests/[testName])

커스텀 디자인 페이지

각 테스트마다 완전히 다른 디자인
테스트별 고유한 브랜딩 및 UI/UX
테스트 시작 버튼 → /tests/[testName]/quiz로 이동



테스트 실행 페이지 (/tests/[testName]/quiz)

커스텀 테스트 로직

각 테스트별로 다른 질문 형태 및 인터랙션
개별 구현된 점수 계산 로직
고유한 진행 방식 (단계별, 페이지별 등)



테스트 결과 페이지 (/tests/[testName]/result/[type])

커스텀 결과 표시

테스트별 고유한 결과 디자인
SNS 공유 기능
사용자 응답 데이터 저장



5.2 관리자 페이지
관리자 로그인 (/admin/login)

로그인 처리 (ADM001)

NextAuth.js 기반 인증
관리자 권한 확인



테스트 목록 관리 (/admin/tests)

테스트 메타데이터 목록 (ADM002)

등록된 테스트 메타데이터를 테이블로 출력
수정/삭제 액션 버튼
활성화/비활성화 토글



테스트 메타데이터 등록 (/admin/tests/new)

테스트 등록 (ADM003)

테스트 ID (URL 경로용)
제목
설명
썸네일 이미지 업로드
테스트 URL 경로
활성화 여부


6. API 설계

6.1 사용자용 API

// 테스트 메타데이터
GET    /api/tests                    // 활성화된 테스트 목록 조회

// 사용자 응답 저장 (각 테스트에서 호출)
POST   /api/responses               // 사용자 응답 데이터 저장


6.2 관리자용 API

// 인증
POST   /api/admin/auth/login        // 관리자 로그인

// 테스트 메타데이터 관리
GET    /api/admin/tests             // 관리자 테스트 목록
POST   /api/admin/tests             // 테스트 메타데이터 생성
GET    /api/admin/tests/[id]        // 테스트 메타데이터 조회
PUT    /api/admin/tests/[id]        // 테스트 메타데이터 수정
DELETE /api/admin/tests/[id]        // 테스트 메타데이터 삭제

// 응답 데이터 조회
GET    /api/admin/responses         // 모든 응답 데이터 조회
GET    /api/admin/responses/[testId] // 특정 테스트 응답 데이터


페이지별 SEO 최적화 중요