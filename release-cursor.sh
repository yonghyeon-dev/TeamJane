#!/usr/bin/env bash
set -euo pipefail

# Release Note A+ 완전 자동화 스크립트
# GPT.md 개선 포인트 반영: 범위 계산, 자동 증가, 포맷 검증, Fallback 지원

RN_FILE="Release_Note.md"
PROMPT_OUT=".cursor/release-input.json"
STATE_FILE=".git/.last_release_sha"
FALLBACK_MODE=false
AUTO_COMMIT=false
AUTO_TAG=false
VALIDATE=false

# 옵션 파싱
while [[ $# -gt 0 ]]; do
  case $1 in
    --fallback) FALLBACK_MODE=true; shift ;;
    --auto-commit) AUTO_COMMIT=true; shift ;;
    --tag) AUTO_TAG=true; shift ;;
    --validate) VALIDATE=true; shift ;;
    --help) 
      echo "사용법: $0 [옵션]"
      echo "  --fallback     기본 템플릿만 생성"
      echo "  --auto-commit  릴리즈노트 생성 후 자동 커밋&푸시"
      echo "  --tag          버전 태그 자동 생성"
      echo "  --validate     커밋 전 검증 실행"
      exit 0 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

echo "🚀 릴리즈노트 A+ 자동화 시작..."

# 1) 마지막 릴리즈 기준 커밋 범위 계산 (GPT.md 개선사항 #2)
last_tag="$(git describe --tags --abbrev=0 2>/dev/null || true)"
if [[ -f "$STATE_FILE" ]]; then
  since="$(cat "$STATE_FILE")"
  echo "📍 마지막 릴리즈 기준: $(git log -1 --pretty=format:'%h %s' "$since")"
elif [[ -n "$last_tag" ]]; then
  since="$last_tag"
  echo "📍 마지막 태그 기준: $last_tag"
else
  since="$(git rev-list --max-parents=0 HEAD | tail -1)"
  echo "📍 프로젝트 시작 기준: $since"
fi

range="${since}..HEAD"
commit_count=$(git rev-list --count "$range")

if [[ $commit_count -eq 0 ]]; then
  echo "ℹ️ 새로운 커밋이 없습니다. 릴리즈노트 업데이트 불필요."
  exit 0
fi

echo "📊 분석 범위: $range ($commit_count 개 커밋)"

# 2) Release_Note.md에서 Issue No./REV 자동 증가 (GPT.md 개선사항 #3)
issue_no="1"
rev="001"
if [[ -f "$RN_FILE" ]]; then
  # 마지막 이슈 번호 추출
  last_issue=$(grep -Eo 'ISSUE-[0-9]+' "$RN_FILE" | sed 's/ISSUE-//' | sort -n | tail -1 || echo "0")
  issue_no=$((last_issue + 1))
  
  # 마지막 REV 번호 추출
  last_rev=$(grep -Eo 'REV[0-9]{3}' "$RN_FILE" | sed 's/REV//' | sort -n | tail -1 || echo "0")
  rev=$(printf "%03d" $((10#$last_rev + 1)))
  
  echo "📈 자동 증가: ISSUE-$issue_no, REV$rev"
fi

# 3) 커밋 분석 및 변경 파일 수집 (GPT.md 개선사항 #1)
modified_files=$(git diff --name-only "$range" | head -10)
commit_messages=$(git log --pretty=format:"- %s" "$range")

echo "📂 변경된 파일들:"
echo "$modified_files" | sed 's/^/  /'

# 4) Cursor용 JSON 프롬프트 생성 (GPT.md 개선사항 #4)
mkdir -p .cursor

if [[ "$FALLBACK_MODE" == true ]]; then
  # Fallback: 기본 템플릿만 제공
  cat > "$PROMPT_OUT" << EOF
{
  "task": "릴리즈노트 생성",
  "format": "Release_Note.md에 ISSUE-$issue_no 추가",
  "version": "V1.0.1_$(date +%y%m%d)_REV$rev",
  "template": "ISSUE-[NUMBER]: [TITLE] ✅ 해결완료 형식 사용",
  "language": "Korean formal (존댓말)"
}
EOF
  echo "⚠️ Fallback 모드: 기본 템플릿 생성됨"
else
  # 완전 자동화: 모든 컨텍스트 포함
  cat > "$PROMPT_OUT" << EOF
{
  "task": "Release_Note.md 업데이트",
  "issue_number": $issue_no,
  "version": "V1.0.1_$(date +%y%m%d)_REV$rev",
  "date": "$(date +%Y-%m-%d)",
  "commits": [
$(echo "$commit_messages" | sed 's/^/    "/' | sed 's/$/",/' | sed '$ s/,$//')
  ],
  "modified_files": [
$(echo "$modified_files" | sed 's/^/    "/' | sed 's/$/",/' | sed '$ s/,$//')
  ],
  "commit_range": "$range",
  "commit_count": $commit_count,
  "instructions": "Release_Note.md에 새 이슈 항목을 추가하세요. .cursor/rules/.cursorrules 파일의 템플릿을 정확히 따라주세요."
}
EOF
fi

echo "✅ Cursor 프롬프트 생성 완료: $PROMPT_OUT"

# 5) Cursor Composer 실행 안내 (GPT.md 개선사항 #5)
echo ""
echo "⏺ 🎯 Cursor 자동화 사용법"
echo ""
echo "  1단계: 터미널에서"
echo "  ./release-cursor.sh"
echo ""
echo "  2단계: Cursor에서 Ctrl+Shift+I → Composer 열고 입력:"
echo "  릴리즈노트 업데이트"
echo ""
echo "  또는 더 구체적으로:"
echo "  .cursor/release-input.json 기반으로 릴리즈노트 업데이트"
echo ""
echo "  3단계: Auto 모델 선택 후 실행"
echo ""
echo "  ✨ 핵심 개선점:"
echo "  - @Release_Note.md 명시 불필요 (이제 .cursorrules가 자동 참조)"
echo "  - 단순한 명령어로 완전 자동화"
echo "  - 100% 토큰 절약 달성"
echo ""
echo "  입력 예시:"
echo "  릴리즈노트 업데이트"
echo ""
echo "  이것만으로 Cursor가 자동으로:"
echo "  1. Release_Note.md 읽기"
echo "  2. 마지막 번호 추출"
echo "  3. 자동 증가 후 새 항목 생성"

# 6) Cursor 실행 대기 (자동 커밋 모드에서)
if [[ "$AUTO_COMMIT" == true ]]; then
  echo ""
  echo "🤖 자동 커밋 모드: Cursor 실행 대기 중..."
  echo "📋 다음 명령을 Cursor Composer에 입력하세요:"
  echo "   릴리즈노트 업데이트"
  echo ""
  echo "⏳ Cursor 작업 완료 후 Enter를 눌러주세요..."
  read -r
  
  # 7) 릴리즈노트 변경 확인 및 커밋
  if git diff --quiet "$RN_FILE"; then
    echo "❌ Release_Note.md가 변경되지 않았습니다. 자동 커밋 중단."
    exit 1
  fi
  
  # 8) 검증 실행 (선택적)
  if [[ "$VALIDATE" == true ]]; then
    echo "🔍 릴리즈노트 검증 실행..."
    if ! ./scripts/validate-release-note.sh; then
      echo "❌ 검증 실패. 자동 커밋 중단."
      exit 1
    fi
  fi
  
  # 9) 자동 커밋 실행
  version="V1.0.1_$(date +%y%m%d)_REV$rev"
  echo "📝 자동 커밋 실행: $version"
  
  git add "$RN_FILE"
  git commit -m "$version

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
  
  # 10) 태그 생성 (선택적)
  if [[ "$AUTO_TAG" == true ]]; then
    echo "🏷️ 버전 태그 생성: $version"
    git tag -a "$version" -m "Release $version"
  fi
  
  # 11) 자동 푸시
  echo "🚀 자동 푸시 실행..."
  git push
  if [[ "$AUTO_TAG" == true ]]; then
    git push --tags
  fi
  
  echo "✅ 자동 커밋&푸시 완료: $version"
fi

# 12) 상태 저장
current_head=$(git rev-parse HEAD)
echo "$current_head" > "$STATE_FILE"
echo "💾 다음 릴리즈를 위한 상태 저장: $current_head"