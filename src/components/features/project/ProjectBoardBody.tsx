"use client";

import {
  getProject,
  getProjectByIds,
  getProjectMemberByUser,
} from "@/lib/api/projects";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { showApiError } from "@/lib/utils/toast";
import { useProjectBoard } from "@/providers/ProjectBoardProvider";
import Container from "@/components/shared/Container";
import ProjectBoardEmpty from "./ProjectBoardEmpty";
import ProjectCard from "./ProjectCard";
import CommonPagination from "@/components/ui/CommonPagination";
import { ProjectCardSkeleton } from "@/components/ui/ProjectCardSkeleton";

export default function ProjectBoard() {
  const { data: session, status } = useSession();
  const { filter } = useProjectBoard();

  const [isLoading, setIsLoading] = useState(true);
  const [projectList, setProjectList] = useState<any[]>([]);
  const [projectMember, setProjectMember] = useState<any>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // fetchAllData를 useCallback으로 감싸서 정의합니다.
  // 이렇게 해야 이 함수가 의존성 배열에 들어가도 무한루프가 돌지 않습니다.
  const fetchAllData = useCallback(async () => {
    const userId = session?.user?.user_id;
    if (status !== "authenticated" || !userId) return;

    try {
      setIsLoading(true);
      let projectResult = null;
      // 프로젝트 목록 조회
      if (filter.view === "personal") {
        const { data: memberData } = await getProjectMemberByUser(userId);

        // 참여 중인 프로젝트가 없는 경우 초기화 후 리턴
        if (!memberData || memberData.length === 0) {
          setIsLoading(false);
          setTotalPage(0);
          setProjectList([]);
          setProjectMember({});
          return;
        }
        const currentIds = memberData
          .map((memberData) => memberData.project_id)
          .join(",");

        projectResult = await getProjectByIds(currentIds, currentPage);
      } else {
        projectResult = await getProject(currentPage);
      }

      const { data, totalCount } = projectResult;

      if (totalCount) {
        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
        setTotalPage(totalPages);
      }

      if (!data) {
        setIsLoading(true);
        return;
      }

      // 프로젝트 목록 가공
      const formattedProjects = data.map((project) => ({
        ...project,
        projectId: project.project_id,
        projectName: project.project_name,
      }));
      setProjectList(formattedProjects);

      const memberMap = data.reduce((acc, project) => {
        const countData = project.project_members;
        const count = countData?.[0]?.count || 0;
        acc[project.project_id] = count;

        return acc;
      }, {});

      setProjectMember(memberMap);
    } catch (err) {
      console.error(err);
      showApiError("데이터를 불러오는 중 오류가 발생했습니다.");
    }
    setIsLoading(false);
  }, [filter.view, status, currentPage, session?.user?.user_id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter.view]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const sortedProjectList = useMemo(() => {
    if (projectList.length === 0) return [];

    const dateFieldMap = {
      createdAt: "created_at",
      startedAt: "started_at",
      updatedAt: "updated_at",
      endedAt: "ended_at",
    };

    const filterKey = filter.date as keyof typeof dateFieldMap;
    const targetKey = dateFieldMap[filterKey] || "created_at";
    const isAsc = filter.sort === "asc";

    // 원본(projectList)을 건드리지 않고 복사하여 정렬
    return [...projectList].sort((a, b) => {
      const timeA = new Date((a as any)[targetKey]).getTime();
      const timeB = new Date((b as any)[targetKey]).getTime();

      return isAsc ? timeA - timeB : timeB - timeA;
    });
  }, [projectList, filter.date, filter.sort]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-400px)]">
        <span className="text-lg text-gray-500">
          프로젝트를 불러오는 중입니다...
        </span>
      </div>
      // <div className="pb-10">
      //   <div className="h-[calc(100vh-400px)] overflow-y-auto">
      //     <div
      //         className="
      //           grid
      //           grid-cols-1
      //           sm:grid-cols-1
      //           md:grid-cols-2
      //           lg:grid-cols-3
      //           gap-4"
      //       >
      //         {Array.from({length: 12}).map((_, index) => {
      //           return (
      //             <ProjectCardSkeleton key={index} />
      //           );
      //         })}
      //       </div>
      //     </div>
      //   </div>
    );
  }

  if (sortedProjectList.length === 0) {
    return (
      <Container className="pt-0">
        <ProjectBoardEmpty />
      </Container>
    );
  }

  return (
    <div className="pb-10">
      <div className="h-[calc(100vh-400px)] overflow-y-auto">
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-4"
        >
          {sortedProjectList.map((project, index) => {
            return (
              <ProjectCard
                key={index}
                project={project}
                setProjectList={setProjectList}
                projectMember={projectMember}
              />
            );
          })}
        </div>
      </div>
      <div>
        <CommonPagination
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
          buttonStyle="arrow"
        />
      </div>
    </div>
  );
}
