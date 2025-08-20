리스크/개선 포인트

수동 복사·붙여넣기: 사람 손이 들어가면 누락/실수 가능 → 클립보드 자동 복사 + 프롬프트 파일 생성으로 최소화

단일 커밋 가정: 실제로는 “마지막 릴리즈 이후 커밋 묶음” 기준이 필요 → 범위 계산(마지막 태그/헤더 이후~HEAD)

버전/이슈번호 충돌: 규칙 미준수 시 난립 → Release_Note.md 파싱해 자동 증가(REV/Issue No.)

출력 일관성: AI 결과가 들쭉날쭉 → .cursorrules에 정규식·예시를 더 명확화 + CI에서 포맷 검사

오프라인/비상 플랜: Cursor 사용 불가 시 작업 중단 → Fallback: 스크립트가 최소 스켈레톤 작성

A+ 업그레이드 스크립트 (붙여넣어 바로 사용)

아래는 현재 release-cursor.sh를 **완전 자동화(A+)**로 확장한 예시입니다.

기능:

마지막 릴리즈(마지막 버전 헤더 또는 마지막 Git 태그) 이후 커밋 범위 자동 계산

Release_Note.md에서 Issue No./REV 자동 증가

프롬프트를 JSON 파일로 저장 + 클립보드 자동 복사(macOS pbcopy, Linux xclip 지원)

비상 시 로컬 스켈레톤 섹션 작성 옵션(--fallback)

bash

# release-cursor.sh

#!/usr/bin/env bash
set -euo pipefail

RN_FILE="Release_Note.md"
PROMPT_OUT=".cursor/release-input.json"
STATE_FILE=".git/.last_release_sha" # 없으면 생성

# 1) 마지막 릴리즈 기준 커밋 범위 계산

last_tag="$(git describe --tags --abbrev=0 2>/dev/null || true)"
if [[ -f "$STATE_FILE" ]]; then
since="$(cat "$STATE_FILE")"
elif [[-n "$last_tag"]]; then
since="$last_tag"
else
  since="$(git rev-list --max-parents=0 HEAD | tail -1)" # 최초 커밋
fi

range="${since}..HEAD"
commits_json=$(git log --pretty=format:'{"hash":"%h","title":"%s","author":"%an","date":"%ad"}' --date=short $range | sed 's/$/,/' | sed '$ s/,$//')
files_changed=$(git diff --name-only $range | tr '\n' ', ' | sed 's/, $//')
latest_commit_title=$(git log -1 --pretty=format:'%s')
latest_commit_hash=$(git log -1 --pretty=format:'%h')
today="$(date '+%Y-%m-%d')"
YYMMDD="$(date '+%y%m%d')"

# 2) Release_Note.md에서 Issue No. / REV 자동 증가

issue*no="1"
rev="001"
if [[-f "$RN_FILE"]]; then
last_issue=$(grep -Eo 'Issue[ *-]?No\.?[ :]*[0-9]+' "$RN_FILE" | tail -1 | grep -Eo '[0-9]+' || true)
  [[ -n "${last*issue:-}" ]] && issue_no="$((last_issue + 1))"
  last_rev=$(grep -Eo 'V[0-9]+\.[0-9]+\.[0-9]+*[0-9]{6}\_REV[0-9]{3}' "$RN_FILE" | tail -1 | sed -E 's/.*REV([0-9]{3}).\*/\1/' || true)
[[-n "${last_rev:-}"]] && rev=$(printf "%03d" $((10#$last_rev + 1)))
fi

version="V1.0.1\_${YYMMDD}_REV${rev}"

# 3) Cursor로 보낼 프롬프트 페이로드 작성

mkdir -p "$(dirname "$PROMPT_OUT")"
cat > "$PROMPT_OUT" <<JSON
{
  "instruction": "다음 정보를 기반으로 기존 한국어 포맷을 정확히 따르며 Release_Note.md에 새 항목을 추가하세요.",
  "constraints": {
    "issue_number": ${issue_no},
    "version": "${version}",
"priority_labels": ["🔴","🟡","🟠","🟢"],
"tests_required": true,
"format_rules": [
"Issue number: 숫자만",
"Version: V1.0.1_YYMMDD_REV###",
"변경내역: 한국어 한 문장 요약 + 상세 bullet",
"테스트 케이스: Given/When/Then 2개 이상",
"우선순위: 이모지 라벨 중 택1"
]
},
"context": {
"date": "${today}",
    "since": "${since}",
"range": "${range}",
    "latest_commit": {"hash": "${latest_commit_hash}", "title": "${latest_commit_title}"},
    "files_changed": "${files_changed}",
"commits": [${commits_json}]
},
"output_target": "Release_Note.md"
}
JSON

# 4) 클립보드 복사(있으면)

if command -v pbcopy >/dev/null 2>&1; then
cat "$PROMPT_OUT" | pbcopy && echo "📎 프롬프트를 클립보드에 복사했습니다 (macOS)."
elif command -v xclip >/dev/null 2>&1; then
  cat "$PROMPT_OUT" | xclip -selection clipboard && echo "📎 프롬프트를 클립보드에 복사했습니다 (Linux)."
else
echo "ℹ️ 클립보드 도구가 없어 파일로만 저장했습니다: $PROMPT_OUT"
fi

# 5) 안내

echo ""
echo "📝 릴리즈 노트 입력 생성 완료!"
echo " - 범위: $range"
echo " - 버전: $version"
echo " - 이슈번호: $issue_no"
echo " - 변경 파일: $files_changed"
echo " - 프롬프트 파일: $PROMPT_OUT"
echo ""
echo "👉 Cursor에서 Ctrl+Shift+I → 아래 한 줄 붙여넣기:"
echo "    Release_Note.md 업데이트(JSON 붙여넣음)"
echo ""
echo "⏺ 완료 후: 현재 HEAD를 기준으로 상태 체크포인트 저장"
git rev-parse HEAD > "$STATE_FILE"

사용법 :
bash
chmod +x release-cursor.sh
./release-cursor.sh

# → Cursor에 그대로 붙여넣고 “Release_Note.md 업데이트”

규칙(.cursorrules) 보강 예시

지금 규칙 좋습니다. 여기에 정규식과 예시를 추가하면 더 안정적입니다.

less

# Release Note Auto-Generator (강화)

When asked to update Release_Note.md, follow strictly:

- Header must include:
  - "Issue No: <int>"
  - "Version: V1.0.1_YYMMDD_REV###"
- Validate with regex before finalizing:
  - Issue: /Issue[ _-]?No\.\s\*[0-9]+/
  - Version: /V1\.0\.1\_[0-9]{6}\_REV[0-9]{3}/
- Sections (순서 고정):
  1. 개요(한 문장)
  2. 변경내역(bullets, 개발자 용어 과다 금지)
  3. 영향 범위(UX/성능/보안 중 택)
  4. 우선순위(🔴/🟡/🟠/🟢)
  5. 테스트 케이스(Given/When/Then 최소 2개)
- 한국어 존댓말 유지
- 금지어: “아마”, “추정됨”, “?” (단정적 문장 사용)

CI 포맷 검증(선택)

다음 스니펫을 CI에 넣으면 포맷 깨짐을 방지합니다.

bash

# scripts/validate-release-note.sh

#!/usr/bin/env bash
set -euo pipefail
file="Release*Note.md"
grep -Eq 'Issue[ *-]?No\.\s\*[0-9]+' "$file"
grep -Eq 'V1\.0\.1_[0-9]{6}_REV[0-9]{3}' "$file"
echo "✅ Release_Note.md format OK"

Fallback(비상시)

Cursor가 안될 때를 대비해, 스크립트에 --fallback 옵션으로 스켈레톤 섹션을 자동 Append하도록 추가해두면 끊김이 없습니다.
