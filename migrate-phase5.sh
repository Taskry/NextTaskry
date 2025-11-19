#!/bin/bash

# Phase 5: Import 경로 일괄 수정
# 프로젝트 루트 디렉토리에서 실행하세요

echo "🚀 Phase 5: Import 경로 일괄 수정"
echo "================================"

# 백업 확인
echo ""
read -p "⚠️  Phase 4 커밋을 완료하셨나요? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ 먼저 Phase 4를 커밋해주세요!"
    exit 1
fi

echo ""
read -p "⚠️  자동 수정을 진행합니다. 계속하시겠습니까? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ 취소되었습니다."
    exit 1
fi

echo ""
echo "📝 1단계: lib API 파일 경로 수정..."

# projectAPI → lib/api/projects
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i '' "s|from '@/lib/projectAPI'|from '@/lib/api/projects'|g" {} + 2>/dev/null || \
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i "s|from '@/lib/projectAPI'|from '@/lib/api/projects'|g" {} + 2>/dev/null
echo "  ✅ projectAPI → api/projects"

# userAPI → lib/api/users
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i '' "s|from '@/lib/userAPI'|from '@/lib/api/users'|g" {} + 2>/dev/null || \
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i "s|from '@/lib/userAPI'|from '@/lib/api/users'|g" {} + 2>/dev/null
echo "  ✅ userAPI → api/users"

# noticeService → lib/api/notices
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i '' "s|from '@/lib/noticeService'|from '@/lib/api/notices'|g" {} + 2>/dev/null || \
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i "s|from '@/lib/noticeService'|from '@/lib/api/notices'|g" {} + 2>/dev/null
echo "  ✅ noticeService → api/notices"

# calendarUtils → lib/utils/calendar
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i '' "s|from '@/lib/calendarUtils'|from '@/lib/utils/calendar'|g" {} + 2>/dev/null || \
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i "s|from '@/lib/calendarUtils'|from '@/lib/utils/calendar'|g" {} + 2>/dev/null
echo "  ✅ calendarUtils → utils/calendar"

echo ""
echo "📝 2단계: app/* 경로를 src/* 경로로 수정..."

# app/types → types
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i '' "s|from '@/app/types|from '@/types|g" {} + 2>/dev/null || \
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i "s|from '@/app/types|from '@/types|g" {} + 2>/dev/null
echo "  ✅ @/app/types → @/types"

# app/hooks → hooks
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i '' "s|from '@/app/hooks|from '@/hooks|g" {} + 2>/dev/null || \
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i "s|from '@/app/hooks|from '@/hooks|g" {} + 2>/dev/null
echo "  ✅ @/app/hooks → @/hooks"

# app/providers → providers
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i '' "s|from '@/app/providers|from '@/providers|g" {} + 2>/dev/null || \
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i "s|from '@/app/providers|from '@/providers|g" {} + 2>/dev/null
echo "  ✅ @/app/providers → @/providers"

# app/components → components
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i '' "s|from '@/app/components|from '@/components|g" {} + 2>/dev/null || \
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i "s|from '@/app/components|from '@/components|g" {} + 2>/dev/null
echo "  ✅ @/app/components → @/components"

echo ""
echo "📝 3단계: 컴포넌트 경로 수정..."

# datePicker → DatePicker
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i '' "s|from '@/components/datepicker/datePicker'|from '@/components/ui/DatePicker'|g" {} + 2>/dev/null || \
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i "s|from '@/components/datepicker/datePicker'|from '@/components/ui/DatePicker'|g" {} + 2>/dev/null
echo "  ✅ datePicker → DatePicker"

# DropdownToggle → Dropdown
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i '' "s|from '@/components/dropdown/DropdownToggle'|from '@/components/ui/Dropdown'|g" {} + 2>/dev/null || \
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" \
  -exec sed -i "s|from '@/components/dropdown/DropdownToggle'|from '@/components/ui/Dropdown'|g" {} + 2>/dev/null
echo "  ✅ DropdownToggle → Dropdown"

echo ""
echo "✅ Phase 5 자동 수정 완료!"
echo ""
echo "🔍 다음 작업:"
echo "1. TypeScript 타입 체크"
echo "   npm run type-check"
echo ""
echo "2. 빌드 테스트"
echo "   npm run build"
echo ""
echo "3. 개발 서버 실행"
echo "   npm run dev"
echo ""
echo "4. 수동으로 확인이 필요한 경우:"
echo "   - 상대 경로로 import하는 파일들"
echo "   - 동적 import"
echo "   - 주석 내 경로 참조"
echo ""
echo "⚠️  에러가 있다면 수동으로 수정해주세요!"
