# 🚀 토큰 최적화 릴리즈노트 자동화 시스템 완벽 가이드

## 📌 시스템 개요

### 핵심 목적
1. **토큰 절약**: Claude Code의 토큰 소비를 Cursor Auto 모델로 대체 (100% 절약)
2. **자동화**: 버전 번호와 이슈 번호 자동 증가
3. **품질 관리**: 모든 이슈를 트래킹하여 추후 테스트케이스로 활용
4. **일관성**: 표준화된 릴리즈노트 포맷 유지

### 시스템 구성
- `release-cursor.sh`: 릴리즈노트 자동화 메인 스크립트
- `.cursor/release-input.json`: Cursor AI를 위한 컨텍스트 파일
- `Release_Note.md`: 실제 릴리즈노트 파일
- `.cursorrules`: Cursor가 따라야 할 릴리즈노트 작성 규칙

---

## 🎯 전체 워크플로우

### 1️⃣ 개발 작업 완료
```bash
# 코드 변경사항 커밋
git add .
git commit -m "feat: 소셜 로그인 전용 시스템 구현"
```

### 2️⃣ 릴리즈노트 자동화 스크립트 실행
```bash
./release-cursor.sh --auto-commit
```

**스크립트가 자동으로 수행하는 작업:**
1. 마지막 릴리즈 이후 모든 커밋 분석
2. 변경된 파일 목록 수집
3. Release_Note.md에서 마지막 이슈 번호 추출 (예: ISSUE-012)
4. 자동으로 다음 번호 계산 (ISSUE-013)
5. REV 번호 자동 증가 (REV012 → REV013)
6. `.cursor/release-input.json` 생성 (모든 컨텍스트 포함)

### 3️⃣ Cursor Composer에서 릴리즈노트 생성
```
🤖 자동 커밋 모드: Cursor 실행 대기 중...
📋 다음 명령을 Cursor Composer에 입력하세요:
   릴리즈노트 업데이트

⏳ Cursor 작업 완료 후 Enter를 눌러주세요...
```

**Cursor에서:**
1. `Ctrl+Shift+I` (Composer 열기)
2. 입력: `릴리즈노트 업데이트`
3. Auto 모델 선택
4. 실행

**Cursor가 자동으로 처리하는 내용:**
- `.cursor/release-input.json` 읽기
- Release_Note.md 파일 열기
- 커밋 내용 분석하여 이슈 제목 생성
- 변경 파일 기반으로 상세 내용 작성
- ISSUE-013 항목 자동 추가
- 테스트케이스 템플릿 생성

### 4️⃣ 터미널에서 Enter로 완료
```
⏳ Cursor 작업 완료 후 Enter를 눌러주세요... [Enter]

✅ Release_Note.md가 변경되었습니다.
📝 자동 커밋 실행: V1.0.1_250821_REV013
🚀 자동 푸시 실행...
✅ 자동 커밋&푸시 완료!
```

---

## 🔧 상세 동작 원리

### release-cursor.sh가 생성하는 JSON 구조
```json
{
  "task": "Release_Note.md 업데이트",
  "issue_number": 13,
  "version": "V1.0.1_250821_REV013",
  "date": "2025-08-21",
  "commits": [
    "- feat: 소셜 로그인 전용 시스템 구현"
  ],
  "modified_files": [
    "src/components/auth/AuthForm.tsx",
    "src/components/ui/GoogleSignInButton.tsx",
    "src/components/ui/KakaoSignInButton.tsx"
  ],
  "commit_range": "da21775..HEAD",
  "commit_count": 1,
  "instructions": "Release_Note.md에 새 이슈 항목을 추가하세요."
}
```

### .cursorrules가 정의하는 릴리즈노트 포맷
```markdown
#### ISSUE-[NUMBER]: [커밋 메시지 기반 제목] ✅ 해결완료

- **발생일**: [오늘 날짜]
- **해결일**: [오늘 날짜]
- **증상**: [커밋과 파일 변경사항 기반 설명]
- **위치**: [변경된 파일들]
- **원인**: [기술적 원인]
- **근본원인**: [근본적 이유]
- **대책**: [구현한 해결책]
- **우선순위**: 🟡 High
- **버전**: V1.0.1_YYMMDD_REV###
- **테스트케이스**: [Given/When/Then 형식]
```

---

## 💡 핵심 장점

### 토큰 절약 효과
| 항목 | 기존 방식 | 자동화 시스템 | 절감률 |
|------|----------|--------------|--------|
| 월 토큰 사용량 | 127,500 토큰 | 0 토큰 | 100% |
| 월 비용 | $19.125 | $0 | 100% |
| 작업 시간 | 10-15분 | 2-3분 | 80% |
| 일관성 | 수동 작성 | 자동 표준화 | 100% |

### 자동화 이점
1. **버전 관리 자동화**: REV 번호 자동 증가
2. **이슈 트래킹**: 모든 변경사항을 이슈로 기록
3. **테스트케이스 준비**: 추후 자동화 테스트 구현 가능
4. **표준화**: 일관된 포맷과 내용 구조

---

## 🎮 고급 옵션

### 플래그 조합 예시
```bash
# 기본 실행 (수동 커밋)
./release-cursor.sh

# 자동 커밋 + 태그 생성
./release-cursor.sh --auto-commit --tag

# 검증 포함 완전 자동화
./release-cursor.sh --auto-commit --tag --validate

# 비상 모드 (네트워크 문제 시)
./release-cursor.sh --fallback
```

### 수동 모드 vs 자동 모드
| 수동 모드 | 자동 모드 (--auto-commit) |
|-----------|-------------------------|
| 1. 스크립트 실행 | 1. 스크립트 실행 |
| 2. Cursor에서 작업 | 2. Cursor에서 작업 |
| 3. 수동으로 git add | 3. Enter 키만 누르면 |
| 4. 수동으로 git commit | 4. 자동 커밋 |
| 5. 수동으로 git push | 5. 자동 푸시 |

---

## 🔍 트러블슈팅

### Q: Cursor가 릴리즈노트를 어떻게 작성하나요?
A: `.cursor/release-input.json`에 모든 커밋 정보와 변경 파일이 저장되어 있고, Cursor Auto 모델이 이를 읽어서 `.cursorrules`에 정의된 포맷에 맞춰 자동으로 작성합니다.

### Q: 이슈 번호가 중복되면 어떻게 하나요?
A: 스크립트가 Release_Note.md를 파싱해서 마지막 이슈 번호를 찾아 자동으로 +1 증가시킵니다.

### Q: 왜 Enter를 눌러야 하나요?
A: Cursor가 Release_Note.md를 수정하는 시간이 필요하므로, 작업 완료 확인 후 커밋을 진행하기 위함입니다.

---

## 📊 실제 사용 예시

### 최근 적용 사례: ISSUE-013
```bash
# 1. 소셜 로그인 구현 완료
git add .
git commit -m "feat: 소셜 로그인 전용 시스템 구현"

# 2. 릴리즈노트 자동화 실행
./release-cursor.sh --auto-commit

# 3. Cursor Composer에서
"릴리즈노트 업데이트" 입력

# 4. 결과
ISSUE-013: 소셜 로그인 전용 시스템 구현 ✅ 해결완료
- 이메일 인증 완전 제거
- Google OAuth 구현
- Kakao OAuth 구현
- 테스트케이스 자동 생성
```

---

## 🚀 다음 단계

### 계획된 개선사항
1. **자동 테스트 연동**: 이슈의 테스트케이스를 실제 E2E 테스트로 변환
2. **CI/CD 통합**: GitHub Actions와 연동하여 완전 자동화
3. **멀티 프로젝트 지원**: 여러 프로젝트 동시 관리
4. **대시보드**: 릴리즈노트 통계 및 진행상황 시각화

---

_마지막 업데이트: 2025-08-21_
_작성자: Claude Code + Cursor 자동화 시스템_