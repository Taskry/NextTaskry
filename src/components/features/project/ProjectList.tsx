// components/project/ProjectList.tsx
"use client";

import { Project } from "@/app/data/mockProjects";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/shared/Icon";

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

const ProjectList = ({ projects, onSelectProject }: ProjectListProps) => {
  if (projects.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10">
        <div className="flex flex-col items-center gap-4">
          <Icon type="board" size={64} color="#93C5FD" />
          <h3 className="text-xl font-bold text-gray-800">프로젝트 없음</h3>
          <p className="text-gray-500">
            나만의 첫 프로젝트를 만들어 시작하세요
          </p>
          <Button variant="primary" btnType="form" icon="plus" size={16}>
            새 프로젝트 만들기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="px-6 py-4 border-b border-gray-200 bg-main-200/80">
        <h2 className="text-xl font-bold text-gray-800">내 프로젝트</h2>
        <p className="text-sm text-gray-600 mt-1">
          프로젝트를 선택하여 칸반보드를 확인하세요
        </p>
      </div>

      {/* 프로젝트 목록 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:border-main-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon type="board" size={24} color="#60A5FA" />
                  <h3 className="font-bold text-lg text-gray-800">
                    {project.name}
                  </h3>
                </div>
                <Icon type="chevronRight" size={20} color="#9CA3AF" />
              </div>
              {project.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {project.description}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  생성일:{" "}
                  {new Date(project.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
