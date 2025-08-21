#!/usr/bin/env bash
set -euo pipefail

# 완전 자동화 릴리즈 스크립트
# 1. 코드 변경사항 커밋
# 2. 릴리즈노트 생성
# 3. 릴리즈노트 커밋

echo "🚀 완전 자동화 릴리즈 프로세스 시작..."

# 1. 변경사항 확인
if git diff --quiet && git diff --cached --quiet; then
    echo "ℹ️ 커밋할 변경사항이 없습니다."
else
    echo "📝 변경사항 커밋 중..."
    
    # 커밋 메시지 입력받기
    echo "커밋 메시지를 입력하세요:"
    read -r commit_message
    
    # 모든 변경사항 스테이징 및 커밋
    git add -A
    git commit -m "$commit_message

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    
    echo "✅ 코드 커밋 완료"
fi

# 2. 릴리즈노트 생성
echo ""
echo "📋 릴리즈노트 생성 중..."
./release-cursor.sh

# 3. Cursor에서 릴리즈노트 업데이트 대기
echo ""
echo "⏳ Cursor에서 Release_Note.md를 업데이트한 후 Enter를 누르세요..."
read -r

# 4. 릴리즈노트 커밋
if git diff --quiet Release_Note.md; then
    echo "ℹ️ Release_Note.md가 변경되지 않았습니다."
else
    echo "📝 릴리즈노트 커밋 중..."
    
    # 버전 추출
    version=$(grep -Eo 'V1\.0\.1_[0-9]{6}_REV[0-9]{3}' Release_Note.md | tail -1)
    
    git add Release_Note.md
    git commit -m "docs: 릴리즈노트 업데이트 $version

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    
    echo "✅ 릴리즈노트 커밋 완료: $version"
fi

# 5. 푸시 옵션
echo ""
echo "🔄 원격 저장소에 푸시하시겠습니까? (y/n)"
read -r push_confirm

if [[ "$push_confirm" == "y" ]]; then
    git push origin main
    echo "✅ 푸시 완료"
fi

echo ""
echo "🎉 전체 릴리즈 프로세스 완료!"