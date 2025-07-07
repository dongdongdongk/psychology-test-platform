# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a psychology test platform built with Next.js 14 that provides various psychological tests to users and collects response data. The platform features custom-designed test pages with unique branding and UI/UX for each test.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, SCSS + CSS Modules
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Backend**: Next.js API Routes, PostgreSQL (Supabase), Prisma ORM
- **Authentication**: NextAuth.js
- **File Upload**: Cloudinary
- **Deployment**: Vercel

## Architecture

The platform follows a unique architecture where:
- Each psychological test has its own completely custom-designed pages
- Admin interface manages only metadata (thumbnails, URLs, titles, descriptions)
- Test logic and UI are individually implemented as Next.js pages
- New tests require development and full site redeployment

## Project Structure

```
src/
├── app/
│   ├── (admin)/
│   │   └── admin/
│   │       ├── login/
│   │       └── tests/
│   ├── tests/
│   │   └── [testName]/          # Each test has unique implementation
│   │       ├── page.tsx         # Test introduction page
│   │       ├── quiz/
│   │       │   └── page.tsx     # Test execution page
│   │       └── result/
│   │           └── [type]/
│   │               └── page.tsx # Test result page
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
```

## Database Schema

**Tests Table**: Stores test metadata only
- id (VARCHAR): Test identifier used in URLs
- title, description, thumbnail_url, test_url
- is_active (BOOLEAN): Controls test visibility

**Admins Table**: Admin user management
- id, username, email, password_hash

**UserResponses Table**: Stores user test responses
- test_id (references tests.id)
- response_data (JSONB): Test-specific response data
- result_data (JSONB): Test-specific result data
- ip_address, user_agent, session_id for tracking

## Key APIs

### User APIs
- `GET /api/tests` - Get active test metadata
- `POST /api/responses` - Save user responses

### Admin APIs
- `POST /api/admin/auth/login` - Admin authentication
- `GET/POST/PUT/DELETE /api/admin/tests` - Test metadata CRUD
- `GET /api/admin/responses` - View user responses

## Development Guidelines

### Test Implementation
- Each test requires custom page implementation at `/tests/[testName]/`
- Test pages should have unique designs and branding
- Implement custom scoring logic for each test
- Include SNS sharing functionality on result pages
- Save user responses via `/api/responses` endpoint

### Admin Features
- Admin only manages metadata, not test content
- Use NextAuth.js for admin authentication
- Admin can activate/deactivate tests
- Provide response data viewing capabilities

### SEO Optimization
- SEO optimization is critical for all pages
- Each test page should have proper meta tags
- Implement proper Open Graph tags for social sharing

## Common Commands

Since this is a new project, common commands will be:
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push database schema
- `npx prisma studio` - Open Prisma Studio

## Important Notes

- Each psychological test is a completely separate implementation
- Tests are not dynamically generated - they're coded individually
- Admin interface is only for metadata management
- User response data collection is essential for the business model
- The platform focuses on data collection rather than dynamic test generation


## Rulse

- bash 질문은 한글로 질문해줘 
- 각 기능을 하나 만들고 커밋하고 푸시해줘
- 메인 컬러를 정하면 나한테 메인컬러가 뭔지 질문해줘
- 최대한 세부적으로 나눠서 나한테 질문하면서 진행해줘