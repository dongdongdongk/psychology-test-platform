# 심리 테스트 플랫폼 개발 가이드

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [아키텍처 구조](#아키텍처-구조)
3. [관리자 인증 시스템](#관리자-인증-시스템)
4. [상태 관리 시스템 (Store)](#상태-관리-시스템-store)
5. [커스텀 Hooks](#커스텀-hooks)
6. [API 로직 플로우](#api-로직-플로우)
7. [컴포넌트 구조](#컴포넌트-구조)
8. [데이터베이스 구조](#데이터베이스-구조)
9. [개발 워크플로우](#개발-워크플로우)

## 🎯 프로젝트 개요

### 핵심 개념
이 프로젝트는 **각 심리 테스트마다 완전히 다른 디자인과 로직을 가진 개별 페이지를 구현**하는 독특한 구조입니다.

**중요한 특징:**
- ❌ 동적 테스트 생성 없음
- ✅ 각 테스트는 개별적으로 코딩된 페이지
- ✅ 관리자는 메타데이터(제목, 썸네일, URL)만 관리
- ✅ 실제 테스트 로직은 개발자가 직접 구현

## 🏗️ 아키텍처 구조

### 디렉토리 구조
```
src/
├── app/                          # Next.js 14 App Router
│   ├── (admin)/                  # 관리자 전용 라우트 그룹
│   │   └── admin/
│   │       ├── login/            # 관리자 로그인
│   │       └── tests/            # 테스트 메타데이터 관리
│   ├── api/                      # API 엔드포인트
│   │   ├── admin/                # 관리자 API
│   │   ├── tests/                # 테스트 관련 API
│   │   ├── responses/            # 사용자 응답 저장 API
│   │   └── contact/              # 연락처 API
│   ├── tests/                    # 실제 테스트 페이지들
│   │   ├── [id]/                 # 동적 테스트 페이지
│   │   │   ├── page.tsx          # 테스트 소개 페이지
│   │   │   ├── quiz/             # 테스트 실행 페이지
│   │   │   └── result/           # 테스트 결과 페이지
│   │   └── stress-test/          # 스트레스 테스트 (개별 구현)
│   ├── about/                    # 정적 페이지들
│   ├── contact/
│   └── faq/
├── components/                   # 재사용 가능한 컴포넌트
│   ├── admin/                    # 관리자 전용 컴포넌트
│   ├── common/                   # 공통 컴포넌트 (Header, Loader)
│   ├── result/                   # 결과 페이지 컴포넌트
│   └── ui/                       # UI 컴포넌트 (차트 등)
├── hooks/                        # 커스텀 React Hooks
├── store/                        # Zustand 상태 관리
├── lib/                          # 유틸리티 라이브러리
├── types/                        # TypeScript 타입 정의
└── utils/                        # 유틸리티 함수
```

### 데이터 플로우
```
사용자 → 테스트 페이지 → 퀴즈 실행 → 결과 계산 → API 저장 → 결과 표시
                ↑              ↑           ↑         ↑
              Store         Hooks      Utils     Database
```

## 🔐 관리자 인증 시스템

### 1. 로그인 프로세스
```
관리자 로그인 시도
    ↓
/api/admin/auth/login 호출
    ↓
bcrypt로 비밀번호 검증
    ↓
JWT 토큰 생성 (NextAuth.js)
    ↓
쿠키에 세션 저장
    ↓
관리자 페이지 접근 허용
```

### 2. 인증 관련 파일들

#### `src/lib/auth.ts` - NextAuth.js 설정
```typescript
// NextAuth.js 설정 파일
// JWT 토큰 생성/검증 로직
// 관리자 세션 관리
```

#### `src/app/api/admin/auth/login/route.ts` - 로그인 API
```typescript
// POST /api/admin/auth/login
// 1. 사용자 입력 검증
// 2. 데이터베이스에서 관리자 조회
// 3. bcrypt로 비밀번호 검증
// 4. JWT 토큰 발급
```

#### `src/middleware.ts` - 라우트 보호
```typescript
// 관리자 페이지 접근 시 인증 확인
// JWT 토큰 검증
// 미인증 시 로그인 페이지로 리다이렉트
```

### 3. 관리자 인증 흐름 상세
```
1. 사용자가 /admin/login 접속
2. 사용자명/비밀번호 입력
3. fetch로 /api/admin/auth/login POST 요청
4. 서버에서 Prisma로 DB 조회
5. bcryptjs.compare()로 비밀번호 검증
6. NextAuth.js로 JWT 토큰 생성
7. 토큰을 httpOnly 쿠키로 저장
8. /admin/tests로 리다이렉트
9. 이후 모든 /admin/* 접근 시 middleware.ts에서 토큰 검증
```

## 🗄️ 상태 관리 시스템 (Store)

### Zustand를 사용하는 이유
- Redux보다 간단하고 보일러플레이트가 적음
- TypeScript와 완벽 호환
- 작은 번들 사이즈
- React 18과 완벽 호환

### 1. Quiz Store (`src/store/quizStore.ts`)
```typescript
interface QuizState {
  currentQuestion: number;      // 현재 질문 번호
  answers: Record<string, any>; // 사용자 답변들
  timeSpent: number;           // 소요 시간
  isCompleted: boolean;        // 완료 상태
  
  // Actions
  setAnswer: (questionId: string, answer: any) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  completeQuiz: () => void;
}
```

**사용 예시:**
```typescript
const { answers, setAnswer, nextQuestion } = useQuizStore();

// 답변 저장
setAnswer('question-1', selectedOption);

// 다음 질문으로
nextQuestion();
```

### 2. Test Creation Store (`src/store/testCreationStore.ts`)
```typescript
interface TestCreationState {
  step: number;                 // 현재 생성 단계
  testData: TestFormData;      // 테스트 메타데이터
  questions: Question[];       // 질문들
  resultTypes: ResultType[];   // 결과 타입들
  
  // Actions
  setStep: (step: number) => void;
  updateTestData: (data: Partial<TestFormData>) => void;
  addQuestion: (question: Question) => void;
  removeQuestion: (id: string) => void;
  saveTest: () => Promise<void>;
}
```

### 상태 관리 흐름
```
컴포넌트에서 useStore() 호출
    ↓
Zustand Store에서 상태 조회
    ↓
액션 실행 시 상태 업데이트
    ↓
구독한 모든 컴포넌트 자동 리렌더링
```

## 🎣 커스텀 Hooks

### 1. `useTestResult` - 테스트 결과 관리
```typescript
// 위치: src/hooks/useTestResult.ts
interface UseTestResultReturn {
  result: TestResult | null;
  loading: boolean;
  error: string | null;
  saveResult: (data: TestData) => Promise<void>;
  calculateScore: (answers: Answer[]) => TestResult;
}
```

**주요 기능:**
- 테스트 결과 계산 로직
- API를 통한 결과 저장
- 로딩/에러 상태 관리
- 점수 계산 알고리즘 실행

### 2. `useRadarChart` - 레이더 차트 데이터
```typescript
// 위치: src/hooks/useRadarChart.ts
interface UseRadarChartReturn {
  chartData: ChartData[];
  maxScore: number;
  averageScore: number;
  formatChartData: (scores: ScoreData) => ChartData[];
}
```

### 3. `useTheme` - 테스트별 테마 관리
```typescript
// 위치: src/hooks/useTheme.ts
interface UseThemeReturn {
  theme: ThemeConfig;
  setTheme: (testId: string) => void;
  resetTheme: () => void;
}
```

### 4. `useResultTitle` - 결과 타이틀 생성
```typescript
// 위치: src/hooks/useResultTitle.ts
interface UseResultTitleReturn {
  title: string;
  subtitle: string;
  description: string;
  generateTitle: (scores: ScoreData) => void;
}
```

### Hooks 사용 패턴
```typescript
function TestResultPage() {
  // 1. 테스트 결과 로직
  const { result, saveResult, calculateScore } = useTestResult();
  
  // 2. 차트 데이터 생성
  const { chartData, formatChartData } = useRadarChart();
  
  // 3. 테마 적용
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    setTheme('stress-test');
    const scores = calculateScore(answers);
    saveResult(scores);
  }, []);
  
  return (
    <div className={theme.containerClass}>
      <RadarChart data={formatChartData(result.scores)} />
    </div>
  );
}
```

## 🌐 API 로직 플로우

### 1. 테스트 메타데이터 API
```
GET /api/tests
├── Prisma로 활성화된 테스트 조회
├── 캐싱 헤더 설정
└── JSON 응답 반환

POST /api/admin/tests
├── 관리자 인증 확인
├── 입력 데이터 검증
├── Prisma로 DB 저장
└── 생성된 테스트 ID 반환
```

### 2. 사용자 응답 저장 API
```
POST /api/responses
├── 요청 데이터 파싱 (testId, answers, result)
├── IP 주소, User-Agent 수집
├── 세션 ID 생성
├── Prisma로 UserResponses 테이블에 저장
├── 성공 응답 반환
└── 에러 시 500 상태 코드와 에러 메시지
```

### 3. 테스트별 결과 API
```
GET /api/tests/[id]/result/[type]
├── 테스트 ID와 결과 타입 파라미터 추출
├── Prisma로 해당 테스트 조회
├── 결과 타입별 데이터 가공
├── 캐싱 헤더 설정 (24시간)
└── 결과 데이터 JSON 반환
```

### API 호출 예시
```typescript
// 테스트 목록 조회
const fetchTests = async () => {
  const response = await fetch('/api/tests');
  const tests = await response.json();
  return tests;
};

// 사용자 응답 저장
const saveResponse = async (testData: TestData) => {
  const response = await fetch('/api/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      testId: testData.testId,
      responseData: testData.answers,
      resultData: testData.result,
      completedAt: new Date().toISOString()
    })
  });
  
  if (!response.ok) {
    throw new Error('응답 저장 실패');
  }
};
```

### 에러 처리 패턴
```typescript
// API 함수에서 공통 에러 처리
const handleApiError = (error: Error, context: string) => {
  console.error(`${context} 에러:`, error);
  
  if (error.message.includes('네트워크')) {
    return '네트워크 연결을 확인해주세요.';
  }
  
  if (error.message.includes('권한')) {
    return '접근 권한이 없습니다.';
  }
  
  return '일시적인 오류가 발생했습니다. 다시 시도해주세요.';
};
```

## 🧩 컴포넌트 구조

### 컴포넌트 계층 구조
```
App Layout (src/app/layout.tsx)
├── Header (src/components/common/Header.tsx)
├── Page Components
│   ├── Test Pages (src/app/tests/[id]/)
│   │   ├── TestIntro Component
│   │   ├── Quiz Component
│   │   └── Result Component
│   └── Admin Pages (src/app/(admin)/)
│       ├── Login Component
│       └── Test Management Components
└── Common Components
    ├── PageLoader
    ├── UI Components (Charts, Buttons)
    └── Result Components
```

### 컴포넌트별 역할

#### 1. 공통 컴포넌트
- **Header**: 네비게이션, 테마 적용
- **PageLoader**: 페이지 로딩 상태 표시
- **RadarChart/BarChart**: 결과 시각화

#### 2. 테스트 컴포넌트
- **TestIntro**: 테스트 소개 및 시작 버튼
- **Quiz**: 질문 표시 및 답변 수집
- **Result**: 결과 계산 및 표시, SNS 공유

#### 3. 관리자 컴포넌트
- **AdminLogin**: 관리자 로그인 폼
- **TestList**: 테스트 목록 및 관리
- **TestCreation**: 새 테스트 생성 마법사

## 💾 데이터베이스 구조

### ERD (Entity Relationship Diagram)
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Admins      │     │     Tests       │     │ UserResponses   │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (VARCHAR)    │     │ id (VARCHAR)    │     │ id (SERIAL)     │
│ username        │     │ title           │◄────┤ test_id         │
│ email           │     │ description     │     │ response_data   │
│ password_hash   │     │ thumbnail_url   │     │ result_data     │
│ created_at      │     │ test_url        │     │ ip_address      │
│ updated_at      │     │ is_active       │     │ user_agent      │
└─────────────────┘     │ created_at      │     │ session_id      │
                        │ updated_at      │     │ completed_at    │
                        └─────────────────┘     │ created_at      │
                                               └─────────────────┘
```

### 테이블 세부 사항

#### Tests 테이블
```sql
CREATE TABLE Tests (
  id VARCHAR PRIMARY KEY,           -- URL에 사용되는 테스트 식별자
  title VARCHAR NOT NULL,           -- 테스트 제목
  description TEXT,                 -- 테스트 설명
  thumbnail_url VARCHAR,            -- 썸네일 이미지 URL
  test_url VARCHAR,                -- 실제 테스트 페이지 URL
  is_active BOOLEAN DEFAULT true,   -- 활성화 상태
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### UserResponses 테이블
```sql
CREATE TABLE UserResponses (
  id SERIAL PRIMARY KEY,
  test_id VARCHAR REFERENCES Tests(id),
  response_data JSONB,              -- 사용자 답변 (JSON 형태)
  result_data JSONB,                -- 계산된 결과 (JSON 형태)
  ip_address INET,                  -- 사용자 IP
  user_agent TEXT,                  -- 브라우저 정보
  session_id VARCHAR,               -- 세션 식별자
  completed_at TIMESTAMP,           -- 완료 시간
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 데이터 예시

#### Tests 테이블 데이터
```json
{
  "id": "stress-test",
  "title": "스트레스 진단 테스트",
  "description": "현재 스트레스 수준을 정확히 진단해보세요",
  "thumbnail_url": "/images/stress-test-thumb.jpg",
  "test_url": "/tests/stress-test",
  "is_active": true
}
```

#### UserResponses 데이터
```json
{
  "test_id": "stress-test",
  "response_data": {
    "question-1": "자주 그렇다",
    "question-2": "보통이다",
    "question-3": "전혀 그렇지 않다"
  },
  "result_data": {
    "totalScore": 45,
    "level": "보통",
    "categories": {
      "work": 60,
      "personal": 30,
      "health": 45
    }
  },
  "ip_address": "192.168.1.1",
  "session_id": "sess_abc123"
}
```

## 🔄 개발 워크플로우

### 새로운 테스트 추가 과정

#### 1단계: 데이터베이스에 테스트 등록
```typescript
// 관리자 페이지에서 또는 직접 DB에 추가
INSERT INTO Tests (id, title, description, test_url, is_active) 
VALUES ('new-test', '새로운 테스트', '테스트 설명', '/tests/new-test', true);
```

#### 2단계: 페이지 구조 생성
```
src/app/tests/new-test/
├── page.tsx              # 테스트 소개 페이지
├── TestPage.module.scss  # 스타일
├── quiz/
│   ├── page.tsx          # 퀴즈 실행 페이지
│   └── QuizPage.module.scss
└── result/
    └── [type]/
        ├── page.tsx      # 결과 페이지
        └── ResultPage.module.scss
```

#### 3단계: 테스트 로직 구현
```typescript
// src/app/tests/new-test/quiz/page.tsx
export default function NewTestQuiz() {
  const { answers, setAnswer, nextQuestion } = useQuizStore();
  const { saveResult, calculateScore } = useTestResult();
  
  const handleSubmit = async () => {
    const result = calculateScore(answers);
    await saveResult({
      testId: 'new-test',
      answers,
      result
    });
    router.push(`/tests/new-test/result/${result.type}`);
  };
  
  return (
    <div className={styles.container}>
      {/* 테스트별 고유한 UI 구현 */}
    </div>
  );
}
```

#### 4단계: 점수 계산 로직
```typescript
// src/utils/scoreCalculator.ts에 추가
export const calculateNewTestScore = (answers: Answer[]): TestResult => {
  // 테스트별 고유한 점수 계산 로직
  const scores = processAnswers(answers);
  const resultType = determineResultType(scores);
  
  return {
    totalScore: scores.total,
    level: resultType,
    categories: scores.categories,
    recommendations: generateRecommendations(resultType)
  };
};
```

#### 5단계: 결과 페이지 구현
```typescript
// src/app/tests/new-test/result/[type]/page.tsx
export default function NewTestResult({ params }: { params: { type: string } }) {
  const { chartData } = useRadarChart();
  const { theme } = useTheme();
  
  return (
    <div className={`${styles.container} ${theme.containerClass}`}>
      <RadarChart data={chartData} />
      {/* 테스트별 고유한 결과 표시 */}
    </div>
  );
}
```

### 코드 컨벤션

#### 1. 파일 명명 규칙
- 컴포넌트: PascalCase (예: `TestResult.tsx`)
- 스타일: kebab-case (예: `test-result.module.scss`)
- 유틸리티: camelCase (예: `scoreCalculator.ts`)
- API: kebab-case (예: `auth/login/route.ts`)

#### 2. 컴포넌트 구조
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Component.module.scss';

interface ComponentProps {
  prop1: string;
  prop2?: number;
}

export default function Component({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks
  const router = useRouter();
  const [state, setState] = useState();
  
  // 2. Effects
  useEffect(() => {
    // 로직
  }, []);
  
  // 3. Event Handlers
  const handleClick = () => {
    // 로직
  };
  
  // 4. Render
  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  );
}
```

#### 3. API 응답 형태
```typescript
// 성공 응답
{
  success: true,
  data: T,
  message?: string
}

// 에러 응답
{
  success: false,
  error: string,
  details?: any
}
```

### 배포 프로세스

#### 1. 개발 환경 테스트
```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드 테스트
npm run lint         # 코드 품질 검사
```

#### 2. 환경 변수 설정
```bash
# .env (개발용)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="dev-secret"

# Vercel (프로덕션용)
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=production-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

#### 3. Git 워크플로우
```bash
git add .
git commit -m "새로운 테스트 추가: [테스트명]"
git push origin master
# Vercel에서 자동 배포 시작
```

## 🔧 트러블슈팅 가이드

### 자주 발생하는 문제들

#### 1. Prisma Client 초기화 오류
**문제**: `Prisma has detected that this project was built on Vercel`
**해결**: `package.json`의 build 스크립트에 `prisma generate` 추가

#### 2. 환경 변수 인식 안됨
**문제**: Vercel에서 환경 변수를 읽지 못함
**해결**: Vercel 대시보드에서 따옴표 없이 환경변수 설정

#### 3. 세션 인증 실패
**문제**: 관리자 로그인 후 바로 로그아웃됨
**해결**: `NEXTAUTH_URL`을 정확한 도메인으로 설정

#### 4. 빌드 시간 초과
**문제**: Next.js 빌드가 2분 이상 걸림
**해결**: 불필요한 의존성 제거, 코드 스플리팅 적용

### 개발 시 주의사항

1. **각 테스트는 완전히 독립적**: 재사용 가능한 컴포넌트로 만들지 말고, 각 테스트마다 고유한 디자인 적용
2. **상태 관리 최소화**: 꼭 필요한 경우에만 Zustand Store 사용
3. **SEO 최적화 필수**: 각 페이지마다 적절한 메타데이터 설정
4. **응답 데이터 저장 필수**: 모든 테스트 완료 시 `/api/responses`로 데이터 저장
5. **에러 핸들링 철저히**: 사용자 경험을 해치지 않도록 에러 상황 대비

이 가이드를 따라 개발하면 일관성 있고 확장 가능한 심리 테스트 플랫폼을 구축할 수 있습니다.