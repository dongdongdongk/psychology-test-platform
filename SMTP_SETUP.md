# SMTP Gmail 설정 가이드

## 1. Gmail 앱 비밀번호 생성

### 단계 1: Gmail 계정 설정
1. Gmail 계정에 로그인
2. Google 계정 관리 페이지로 이동 (https://myaccount.google.com)
3. 왼쪽 메뉴에서 "보안" 클릭

### 단계 2: 2단계 인증 활성화
1. "2단계 인증" 섹션에서 2단계 인증이 활성화되어 있는지 확인
2. 비활성화되어 있다면 활성화 진행

### 단계 3: 앱 비밀번호 생성
1. "2단계 인증" 섹션에서 "앱 비밀번호" 클릭
2. 드롭다운에서 "메일" 선택
3. 기기 이름 입력 (예: "심리테스트 플랫폼")
4. "생성" 클릭
5. **생성된 16자리 비밀번호를 복사해두세요** (다시 볼 수 없습니다)

## 2. .env 파일 설정

```env
# SMTP 메일 설정
SMTP_EMAIL="your-gmail@gmail.com"           # Gmail 주소
SMTP_PASSWORD="abcd efgh ijkl mnop"         # 생성된 앱 비밀번호 (공백 포함)
ADMIN_EMAIL="admin@yoursite.com"            # 문의 메일을 받을 관리자 이메일
NEXT_PUBLIC_BASE_URL="http://localhost:3000" # 개발 환경
```

## 3. 프로덕션 환경 설정

### Vercel 환경변수 설정
```bash
# Vercel CLI 사용시
vercel env add SMTP_EMAIL
vercel env add SMTP_PASSWORD
vercel env add ADMIN_EMAIL
vercel env add NEXT_PUBLIC_BASE_URL
```

### 또는 Vercel Dashboard에서 설정:
1. Vercel 프로젝트 대시보드 접속
2. Settings > Environment Variables
3. 각 환경변수 추가:
   - `SMTP_EMAIL`: Gmail 주소
   - `SMTP_PASSWORD`: 앱 비밀번호
   - `ADMIN_EMAIL`: 관리자 이메일
   - `NEXT_PUBLIC_BASE_URL`: 실제 도메인 (예: https://yoursite.com)

## 4. 보안 주의사항

### 📌 중요!
- **앱 비밀번호는 일반 Gmail 비밀번호와 다릅니다**
- **앱 비밀번호는 공백을 포함합니다** (예: "abcd efgh ijkl mnop")
- **앱 비밀번호는 절대 공개 저장소에 업로드하지 마세요**
- **.env 파일이 .gitignore에 포함되어 있는지 확인하세요**

### 앱 비밀번호 관리
- 필요없어지면 삭제: Google 계정 관리 > 보안 > 앱 비밀번호 > 삭제
- 정기적으로 갱신하는 것을 권장합니다

## 5. 테스트 방법

1. 환경변수 설정 후 개발 서버 재시작:
   ```bash
   npm run dev
   ```

2. /contact 페이지에서 테스트 문의 발송

3. 다음 확인:
   - 관리자 이메일로 문의 내용 도착
   - 문의자 이메일로 자동 응답 도착
   - 개발자 콘솔에 에러 없음

## 6. 문제 해결

### 일반적인 오류들:

**1. "Invalid login" 오류**
- 앱 비밀번호가 올바른지 확인
- 2단계 인증이 활성화되어 있는지 확인

**2. "Username and Password not accepted" 오류**
- Gmail 주소가 정확한지 확인
- 앱 비밀번호에 공백이 포함되어 있는지 확인

**3. 메일이 스팸함에 도착**
- Gmail에서 발송되므로 대부분 정상 도착
- 처음에는 스팸함 확인 필요

**4. 환경변수가 인식되지 않음**
- 개발 서버 재시작 필요
- .env 파일이 프로젝트 루트에 있는지 확인

## 7. 추가 설정 (선택사항)

### 커스텀 이메일 템플릿
- `/src/app/api/contact/route.ts`에서 HTML 템플릿 수정 가능
- CSS 인라인 스타일 사용 권장 (이메일 클라이언트 호환성)

### 메일 발송 로그
- 메일 발송 성공/실패 로그는 서버 콘솔에 기록됨
- 필요시 별도 로깅 시스템 구축 가능