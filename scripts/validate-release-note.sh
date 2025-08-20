#!/usr/bin/env bash
set -euo pipefail

# Release Note 포맷 검증 스크립트 (GPT.md 개선사항 #4)
# CI에서 자동 실행하여 릴리즈노트 포맷 일관성 보장

RN_FILE="Release_Note.md"
ERRORS=0

echo "🔍 Release_Note.md 포맷 검증 시작..."

if [[ ! -f "$RN_FILE" ]]; then
  echo "❌ $RN_FILE 파일이 존재하지 않습니다."
  exit 1
fi

# 1) Issue 번호 포맷 검증
echo "📋 Issue 번호 형식 검증..."
if ! grep -Eq 'ISSUE-[0-9]+:' "$RN_FILE"; then
  echo "❌ Issue 번호 형식 오류: ISSUE-숫자: 형식이 필요합니다."
  ((ERRORS++))
else
  issue_count=$(grep -c 'ISSUE-[0-9]+:' "$RN_FILE")
  echo "✅ Issue 번호 형식 정상 (${issue_count}개)"
fi

# 2) 버전 번호 포맷 검증  
echo "🔖 버전 번호 형식 검증..."
if ! grep -Eq 'V1\.0\.1_[0-9]{6}_REV[0-9]{3}' "$RN_FILE"; then
  echo "❌ 버전 번호 형식 오류: V1.0.1_YYMMDD_REV### 형식이 필요합니다."
  ((ERRORS++))
else
  version_count=$(grep -c 'V1\.0\.1_[0-9]\{6\}_REV[0-9]\{3\}' "$RN_FILE")
  echo "✅ 버전 번호 형식 정상 (${version_count}개)"
fi

# 3) 필수 섹션 검증
echo "📑 필수 섹션 검증..."
required_sections=("발생일" "해결일" "증상" "위치" "원인" "대책" "버전" "테스트케이스")

for section in "${required_sections[@]}"; do
  if ! grep -q "**${section}**:" "$RN_FILE"; then
    echo "⚠️ 필수 섹션 누락 가능: $section"
  fi
done

# 4) 금지어 검증 (GPT.md 개선사항 #4)
echo "🚫 금지어 검증..."
prohibited_words=("아마" "추정됨" "?" "대략" "보통" "생각됩니다")

for word in "${prohibited_words[@]}"; do
  if grep -q "$word" "$RN_FILE"; then
    echo "⚠️ 금지어 발견: '$word' - 단정적 표현으로 변경 필요"
    grep -n "$word" "$RN_FILE" | head -3
  fi
done

# 5) 우선순위 라벨 검증
echo "🏷️ 우선순위 라벨 검증..."
priority_labels=("🔴" "🟡" "🟠" "🟢")
has_priority=false

for label in "${priority_labels[@]}"; do
  if grep -q "$label" "$RN_FILE"; then
    has_priority=true
    break
  fi
done

if [[ "$has_priority" == "false" ]]; then
  echo "⚠️ 우선순위 라벨 누락: 🔴/🟡/🟠/🟢 중 하나 필요"
fi

# 6) 테스트케이스 형식 검증
echo "🧪 테스트케이스 형식 검증..."
if ! grep -q "```javascript" "$RN_FILE"; then
  echo "⚠️ JavaScript 테스트케이스 누락"
elif ! grep -q "it('should" "$RN_FILE"; then
  echo "⚠️ Jest/Playwright 테스트 형식 누락"
else
  test_count=$(grep -c "it('should" "$RN_FILE")
  echo "✅ 테스트케이스 형식 정상 (${test_count}개)"
fi

# 7) 결과 요약
echo ""
echo "📊 검증 결과 요약:"
if [[ $ERRORS -eq 0 ]]; then
  echo "✅ Release_Note.md 포맷 검증 통과!"
  echo "📈 품질 점수: A+ (모든 규칙 준수)"
else
  echo "❌ $ERRORS개의 포맷 오류 발견"
  echo "📉 품질 점수: 개선 필요"
  exit 1
fi

# 8) 통계 출력
echo ""
echo "📈 릴리즈노트 통계:"
echo "  - 총 이슈 개수: $(grep -c 'ISSUE-[0-9]*:' "$RN_FILE")"
echo "  - 해결완료: $(grep -c '✅ 해결완료' "$RN_FILE")"
echo "  - 진행중: $(grep -c '⏳ 진행중' "$RN_FILE")"
echo "  - Critical 이슈: $(grep -c '🔴' "$RN_FILE")"
echo "  - 마지막 버전: $(grep -Eo 'V1\.0\.1_[0-9]{6}_REV[0-9]{3}' "$RN_FILE" | tail -1)"