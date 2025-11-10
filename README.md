## 🚀 Taskry
Project of "DAN_DA_DAN"
version: Nextjs 

칸반보드 기반 프로젝트 관리 협업 환경을 제공하는 웹 기반 협업툴입니다.

## 💡 개요
- **업무 진행 현황의 시각화**: 업무의 진행 상태를 단계별로 구분화하여 시각적으로 표현 및 상태를 손쉽게 변경 할 수 있도록 구현합니다.
- **직관적이고 간결한 사용자 경험(UX)제공**:  사용자가 복잡한 기능 없이도 쉽게 이해하고 사용할 수 있는 UI를 구현합니다. 더불어 반응형 디자인을 적용해 PC, 모바일 등 다양한 환경에서 접근이 가능하도록 구현합니다.
- **협업 환경 구축**: 사용자 작업 현황이 즉시 반영되도록 하여 원활한 협업이 가능할 수 있도록 설계합니다.
- **유연하고 확장 가능한 일정**: 일정 추가, 삭제, 수정 및 팀원, 중요도 기반 필터링, 검색 기능을 통해서 원하는 정보를 빠르고 유연하게 제공합니다.

## 🛠️ 기술 스택
- Next.js + React + JavaScript: 핵심 프론트엔드 라이브 언어
- npm: 패키지 관리 도구
- React Context: 상태 관리 도구
- ESLint + Prettier: 코드 스타일 및 포맷팅 도구
- TailwindCSS: 빠르고 일관된 UI 스타일링에 사용
- supabase: google OAuth, 데이터베이스
## 📦 설치 및 실행 방법
### 1. 저장소 복제
```
git clone https://github.com/Taskry/NextTaskry.git
```

### 2. 의존성 설치
```
npm install
```

### 3. 실행
```
npm run dev
```

## 📁 프로젝트 구조
``` 
teskry/
├── public/                 # 정적 파일을 제공하는 폴더 (예: 이미지, 폰트, favicon.ico)
│   └── favicon.ico         # 웹사이트의 파비콘
app/                        # App Router (Next.js 13+ 권장)의 핵심 폴더
│   ├── layout.tsx          # 해당 세그먼트와 자식 세그먼트에 적용되는 공유 UI 
│   ├── page.tsx            # 해당 세그먼트의 고유한 UI를 정의하며, URL 경로에 매핑됨
│   ├── loading.tsx         # 해당 세그먼트의 데이터를 로드하는 동안 표시되는 로딩 UI
│   ├── error.tsx           # 해당 세그먼트와 자식 세그먼트에서 발생하는 에러를 처리하는 UI
│   ├── not-found.tsx       # 해당 세그먼트에서 경로를 찾을 수 없을 때 표시되는 UI
│   ├── template.tsx        # 레이아웃과 비슷하지만, 마운트될 때마다 인스턴스가 다시 생성됨 이션 등
│   ├── global-error.tsx    # 전체 애플리케이션에서 발생하는 에러를 처리하는 UI (최상위)
│   ├── api/                # API 라우트를 정의하는 폴더 (서버리스 함수)
│   │   └── hello/          # 예: /api/hello 경로에 해당
│   │       └── route.tsx    # API 핸들러 함수를 정의 (GET, POST 등)
│   ├── sample/              # 예: /sample 경로에 해당 // sample 페이지
│   │   ├── color
│   │   │   └── page.tsx    # /sample/color 페이지 UI
│   │   └── icon            
│   │   │   └── page.tsx    # /sample/icon 페이지 UI
│   └── (auth)/             # (괄호)로 묶인 폴더는 'Route Group'으로, URL 경로에는 포함되지 않음
│       ├── login/          # 예: /login 경로에 해당
│       │   └── page.tsx    # 로그인 페이지 UI
│       └── signup/         # 예: /signup 경로에 해당
│           └── page.tsx    # 회원가입 페이지 UI
├── components/             # 재사용 가능한 UI 컴포넌트들을 모아두는 곳
│   ├── Icon            
│   │   └── Icon.tsx        # 아이콘 컴포넌트
├── lib/                    # 유틸리티 함수, 헬퍼, 데이터베이스 연결, 공통 로직 등을 담는 곳
│   ├── utils.ts            # 유틸리티 함수 모음
│   └── db.ts               # 데이터베이스 관련 로직
├── types/                  # TypeScript 타입 정의 파일을 저장하는 곳
│   └── index.d.ts          # 전역 또는 공통 타입 정의
├── .env                    # 환경 변수를 설정하는 파일 (로컬 개발 시 사용, Git에 포함하지 않음)
├── .eslintrc.json          # ESLint (코드 린팅 도구) 설정을 정의
├── .gitignore              # Git이 추적하지 않을 파일 및 폴더를 지정
├── next-env.d.ts           # Next.js 환경에 대한 TypeScript 타입 정의 파일
├── next.config.js          # Next.js 설정 파일 (Webpack, 환경 변수, 이미지 최적화 등)
├── package.json            # 프로젝트의 메타데이터 및 의존성을 정의
├── postcss.config.js       # PostCSS 설정을 정의 (주로 Tailwind CSS와 함께 사용)
├── README.md               # 프로젝트 설명 파일
├── tailwind.config.ts      # Tailwind CSS 설정 파일
└── tsconfig.json           # TypeScript 컴파일러 설정을 정의
```

🙏 감사합니다

이 프로젝트에 관심을 가져주셔서 감사합니다!