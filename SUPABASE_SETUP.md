# 📚 Next.js + Supabase 연결 가이드 (초보자용)

## 🎯 개요
이 문서는 Next.js 프로젝트를 Supabase 데이터베이스에 연결하는 방법을 단계별로 설명합니다.

## 🔍 Supabase란?
- **Supabase**: 클라우드 기반 PostgreSQL 데이터베이스 서비스
- **장점**: 무료, 설정 간단, 실시간 기능 제공
- **용도**: 웹 애플리케이션의 백엔드 데이터베이스

## 📋 연결 방법 (2가지)

### 방법 1: Prisma를 통한 직접 연결 (우리가 사용한 방법)
```
Next.js ← Prisma ORM ← PostgreSQL 연결 문자열 → Supabase PostgreSQL
```

### 방법 2: Supabase JavaScript 클라이언트
```
Next.js ← @supabase/supabase-js ← API 호출 → Supabase
```

## 🛠️ 단계별 설정 과정

### 1단계: Supabase 프로젝트 생성
1. https://supabase.com 접속
2. 계정 생성/로그인
3. "New project" 클릭
4. 프로젝트 정보 입력:
   - **Name**: `psychology-test-platform`
   - **Database Password**: 강력한 비밀번호 (예: `KimDongHyun14582367`)
   - **Region**: Northeast Asia 선택
5. 프로젝트 생성 완료 (2-3분 대기)

### 2단계: 연결 정보 수집

#### A. 데이터베이스 연결 정보 (Prisma용)
**위치**: Supabase 대시보드 > Settings > Database > Connection string

**수집할 정보**:
```
Host: aws-0-ap-northeast-2.pooler.supabase.com
Port: 5432 (Direct) 또는 6543 (Pooling)
Database: postgres
Username: postgres.프로젝트ID
Password: [설정한 비밀번호]
```

**최종 형태**:
```
postgresql://postgres.mubrtiwgrcwvpbyedvtp:KimDongHyun14582367@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres
```

#### B. API 연결 정보 (JavaScript 클라이언트용)
**위치**: Supabase 대시보드 > Settings > API

**수집할 정보**:
- **Project URL**: `https://mubrtiwgrcwvpbyedvtp.supabase.co`
- **anon key**: 긴 JWT 토큰 문자열 (예: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3단계: 환경변수 설정

프로젝트 루트에 `.env` 파일 생성:

```bash
# Supabase 클라이언트용 (JavaScript)
NEXT_PUBLIC_SUPABASE_URL=https://mubrtiwgrcwvpbyedvtp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Prisma용 (데이터베이스 직접 연결)
DATABASE_URL="postgresql://postgres.mubrtiwgrcwvpbyedvtp:KimDongHyun14582367@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"

# NextAuth 설정
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="psychology-test-platform-secret-key-2025-very-secure-random-string"
```

### 4단계: 패키지 설치

```bash
# Supabase JavaScript 클라이언트
npm install @supabase/supabase-js

# Prisma ORM (이미 설치됨)
npm install prisma @prisma/client
```

### 5단계: Supabase 클라이언트 초기화

`src/lib/supabase.ts` 파일 생성:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 6단계: Prisma 스키마 설정

`prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Test {
  id           String   @id @db.VarChar(50)
  title        String   @db.VarChar(255)
  description  String?  @db.Text
  thumbnailUrl String?  @map("thumbnail_url") @db.VarChar(500)
  testUrl      String   @map("test_url") @db.VarChar(500)
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  responses UserResponse[]

  @@map("tests")
}

// ... 다른 모델들
```

### 7단계: 데이터베이스 초기화

```bash
# 1. Prisma 클라이언트 생성
npm run db:generate

# 2. 데이터베이스 스키마 생성
npm run db:push

# 3. 샘플 데이터 생성
npm run db:seed
```

### 8단계: 개발 서버 실행

```bash
npm run dev
```

## 🔧 사용 방법

### Prisma를 통한 데이터베이스 조작

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**API에서 사용**:
```typescript
// src/app/api/tests/route.ts
import { prisma } from '@/lib/prisma'

export async function GET() {
  const tests = await prisma.test.findMany({
    where: { isActive: true }
  })
  return NextResponse.json(tests)
}
```

### Supabase 클라이언트를 통한 데이터 조작

```typescript
// 컴포넌트에서 사용
import { supabase } from '@/lib/supabase'

async function fetchTests() {
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .eq('is_active', true)
  
  if (error) {
    console.error('Error:', error)
    return []
  }
  
  return data
}
```

## 🎯 두 방법의 차이점

| 특징 | Prisma | Supabase Client |
|------|--------|-----------------|
| **용도** | 서버사이드 (API Routes) | 클라이언트사이드 + 서버사이드 |
| **타입 안전성** | 강력한 TypeScript 지원 | 기본적인 TypeScript 지원 |
| **실시간** | 지원 안함 | 실시간 구독 지원 |
| **마이그레이션** | 강력한 마이그레이션 도구 | 기본적인 스키마 관리 |
| **학습 곡선** | 높음 | 낮음 |

## 📁 파일 구조

```
src/
├── lib/
│   ├── prisma.ts          # Prisma 클라이언트
│   └── supabase.ts        # Supabase 클라이언트
├── app/
│   ├── api/               # API Routes (Prisma 사용)
│   └── components/        # React 컴포넌트 (Supabase 클라이언트 사용)
└── prisma/
    ├── schema.prisma      # 데이터베이스 스키마
    └── seed.ts            # 초기 데이터
```

## ⚠️ 주의사항

1. **환경변수 보안**:
   - `.env` 파일을 Git에 커밋하지 마세요
   - `NEXT_PUBLIC_` 접두사가 있는 변수는 클라이언트에 노출됩니다

2. **anon key**:
   - Row Level Security (RLS)가 설정되어야 안전합니다
   - 민감한 데이터는 서버사이드에서만 처리하세요

3. **연결 한도**:
   - Supabase 무료 플랜은 동시 연결 수에 제한이 있습니다
   - Connection Pooling 사용을 권장합니다

## 🎉 완료!

이제 Next.js 애플리케이션이 Supabase에 성공적으로 연결되었습니다:

- ✅ **메인 페이지**: http://localhost:3000
- ✅ **관리자 로그인**: http://localhost:3000/admin/login (admin/admin123)
- ✅ **스트레스 테스트**: http://localhost:3000/tests/stress-test

## 🔗 유용한 링크

- [Supabase 공식 문서](https://supabase.com/docs)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [Next.js + Supabase 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)