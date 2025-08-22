# 🚀 즉시 실행 가이드 - 현재 상황 기준

> 포트 3001, Supabase 2개 프로젝트 기준 설정 가이드

## 1️⃣ Supabase Dashboard OAuth 설정 (10분)

### 개발 프로젝트 설정
1. [Supabase Dashboard](https://app.supabase.com) 접속
2. **"Weave ERP Development"** 프로젝트 선택 (fsumnnfbywndjegrvtku)
3. 좌측 메뉴 → Authentication → Providers

### Google OAuth 활성화
```
✅ Enable Google 토글 ON
Client ID: [Google Console에서 복사]
Client Secret: [Google Console에서 복사]
```

### Kakao OAuth 활성화
```
✅ Enable Kakao 토글 ON
Client ID (REST API Key): [Kakao Developers에서 복사]
Client Secret: [Kakao Developers에서 복사]
```

---

## 2️⃣ Google Cloud Console 설정 (15분)

### 빠른 설정
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성: "Weave-Dev"
3. OAuth 동의 화면 → External → 생성

### OAuth 2.0 클라이언트 생성
```
애플리케이션 유형: 웹 애플리케이션
이름: Weave Development 3001

승인된 JavaScript 출처:
✅ http://localhost:3001     ← 중요! 3001입니다
✅ http://127.0.0.1:3001

승인된 리디렉션 URI:
✅ http://localhost:3001/auth/callback
✅ https://fsumnnfbywndjegrvtku.supabase.co/auth/v1/callback
```

### 받을 정보
```
Client ID: xxxxx.apps.googleusercontent.com
Client Secret: GOCSPX-xxxxx
```

---

## 3️⃣ Kakao Developers 설정 (10분)

### 빠른 설정
1. [Kakao Developers](https://developers.kakao.com) 접속
2. 애플리케이션 추가: "Weave Dev"
3. 앱 키 → REST API 키 복사

### 플랫폼 등록
```
Web 플랫폼 등록:
✅ http://localhost:3001     ← 중요! 3001입니다
```

### Redirect URI 등록
```
카카오 로그인 → Redirect URI:
✅ http://localhost:3001/auth/callback
✅ https://fsumnnfbywndjegrvtku.supabase.co/auth/v1/callback
```

### 동의항목 설정
```
카카오 로그인 → 동의항목:
✅ 프로필 정보 (필수)
✅ 카카오계정(이메일) (필수)
```

---

## 4️⃣ 환경변수 확인 (.env.local)

현재 설정이 올바른지 확인:
```env
# ✅ 이미 올바르게 설정됨
NEXT_PUBLIC_SUPABASE_URL=https://fsumnnfbywndjegrvtku.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# ✅ 포트 3001 확인
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

---

## 5️⃣ 테스트 (5분)

### 개발 서버 실행
```bash
npm run dev
# http://localhost:3001 접속
```

### 테스트 순서
1. http://localhost:3001/login 접속
2. Google 로그인 버튼 클릭
3. Google 계정 선택
4. /dashboard로 리디렉션 확인

### 성공 체크리스트
- [ ] Google 로그인 팝업 표시
- [ ] 권한 동의 화면 표시
- [ ] 로그인 후 대시보드 이동
- [ ] 우측 상단에 사용자 정보 표시

---

## ⚠️ 주의사항 (포트 3001)

### 모든 설정에서 3001 사용!
- ❌ localhost:3000 (사용하지 마세요)
- ✅ localhost:3001 (이것을 사용하세요)

### 브라우저 접속도 3001
```
http://localhost:3001
```

---

## 🆘 문제 해결

### "redirect_uri_mismatch" 에러
```
해결: Google Console에서 정확히 추가
http://localhost:3001/auth/callback
```

### "Invalid OAuth Credentials" 에러
```
해결: Supabase Dashboard에서 저장 버튼 클릭
잠시 기다린 후 재시도 (캐시 갱신)
```

### 로그인 후 아무 일도 없음
```
해결: 브라우저 콘솔 확인
Network 탭에서 callback 요청 확인
```

---

## 📱 운영 환경 설정 (나중에)

### 운영 Supabase 프로젝트
```
프로젝트: yonghyeon-dev's Project
ID: nmwvuxfhyroxczfsrgdn
생성일: 2025-08-12 (이미 존재)
```

### 운영 OAuth 설정
- 별도의 Google OAuth 클라이언트 필요
- 실제 도메인으로 리디렉션 URI 설정
- 앱 검증 프로세스 진행

---

## ✅ 작업 완료 체크리스트

### 오늘 완료할 것 (30분)
- [ ] Google Cloud Console OAuth 생성
- [ ] Kakao Developers 앱 생성
- [ ] Supabase Dashboard에 키 입력
- [ ] localhost:3001에서 테스트

### 내일 완료할 것
- [ ] 운영 환경 OAuth 설정
- [ ] Vercel 배포 설정 확인
- [ ] 환경별 분리 검증

---

_포트 3001 기준으로 모든 설정을 진행하세요!_
_개발 프로젝트: fsumnnfbywndjegrvtku_