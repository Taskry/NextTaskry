// Mock 프로젝트 데이터

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const mockProjects: Project[] = [
  {
    id: "project-1",
    name: "웹 서비스 리뉴얼",
    description: "메인 서비스 UI/UX 개선 및 성능 최적화",
    created_at: "2025-11-01T00:00:00Z",
    updated_at: "2025-11-13T00:00:00Z",
  },
  {
    id: "project-2",
    name: "모바일 앱 개발",
    description: "iOS/Android 크로스 플랫폼 앱 개발",
    created_at: "2025-11-05T00:00:00Z",
    updated_at: "2025-11-13T00:00:00Z",
  },
  {
    id: "project-3",
    name: "백엔드 API 개선",
    description: "REST API 성능 개선 및 문서화",
    created_at: "2025-11-10T00:00:00Z",
    updated_at: "2025-11-13T00:00:00Z",
  },
];
