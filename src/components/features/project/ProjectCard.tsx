"use client";

import Button from "@/components/ui/Button";
import { Icon } from "@/components/shared/Icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/features/project/Card";
import {
  deleteProject,
  deleteProjectMember,
  getProject,
  getProjectByIds,
  getProjectMember,
  getProjectMemberByUser,
} from "@/lib/api/projects";
import Link from "next/link";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { showApiError, showToast } from "@/lib/utils/toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { DeleteDialog } from "./DeleteDialog";
import PorjectCardFilter from "./ProjectFilter";
import { supabase } from "@/lib/supabase/supabase";
import ProjectPagination from "./ProjectPagination";

interface ProjectCardProps {
  onSelectProject?: (projectId: string) => void;
}

interface FilterProps {
  view: string;
  date: string;
  sort: string;
}

export default function ProjectCard({ onSelectProject }: ProjectCardProps) {
  const [projectList, setProjectList] = useState<any[]>([]);
  const [projectMember, setProjectMember] = useState<any>({});
  const [filter, setFilter] = useState<FilterProps>({
    view: "all",
    date: "startedAt",
    sort: "asc"
  });
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const ITEMS_PER_PAGE = 16;
  const { data: session, status } = useSession();

  // fetchAllData를 useCallback으로 감싸서 정의합니다.
  // 이렇게 해야 이 함수가 의존성 배열에 들어가도 무한루프가 돌지 않습니다.
  const fetchAllData = useCallback(async () => {
    const userId = session?.user?.user_id;
    if (status !== "authenticated" || !userId) return;
    try {
      let projectResult = null;
      // 프로젝트 목록 조회
      if (filter.view === "personal") {
        const { data: memberData } = await getProjectMemberByUser(userId);
      
        // 참여 중인 프로젝트가 없는 경우 초기화 후 리턴
        if (!memberData || memberData.length === 0) {
          setTotalPage(0);
          setProjectList([]);
          setProjectMember({});
          return;
        }
        const currentIds = memberData.map((memberData) => memberData.project_id).join(',');

        projectResult = await getProjectByIds(currentIds, currentPage);
      } else {
        projectResult = await getProject(currentPage);
      }
      
      const {data, totalCount} = projectResult;
      
      if (totalCount) {
        const totalPages = Math.ceil(totalCount/ITEMS_PER_PAGE)
        setTotalPage(totalPages);
      }
      
      if (!data) return;

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
}, [filter.view, status, currentPage, session?.user?.user_id]);

useEffect(() => {
  setCurrentPage(1);
}, [filter.view])
useEffect(() => {
  fetchAllData();
}, [fetchAllData]);

// useEffect(() => {
//   const channel = supabase
//     .channel('realtime-projects') // 채널 이름은 아무거나 상관없음
//     .on(
//       'postgres_changes',
//       {
//         event: '*', // INSERT, UPDATE, DELETE 모두 감지
//         schema: 'public',
//         table: 'projects', // 감시할 테이블 명
//       },
//       (payload) => {
//         console.log('변경사항 감지:', payload)
//         fetchAllData();
//       }
//     )
//     .subscribe()

//   // 컴포넌트 언마운트 시 구독 해제
//   return () => {
//     supabase.removeChannel(channel)
//   }
// }, [supabase, fetchAllData]);

const sortedProjectList = useMemo(() => {
  if (projectList.length === 0) return [];

  const dateFieldMap = {
    createdAt: "created_at",
    startedAt: "started_at",
    updatedAt: "updated_at",
    endedAt: "ended_at"
  };

  const filterKey = filter.date as keyof typeof dateFieldMap;
  const targetKey = dateFieldMap[filterKey] || 'created_at';
  const isAsc = filter.sort === 'asc';

  // 원본(projectList)을 건드리지 않고 복사하여 정렬
  return [...projectList].sort((a, b) => {
    const timeA = new Date((a as any)[targetKey]).getTime();
    const timeB = new Date((b as any)[targetKey]).getTime();
    
    return isAsc ? timeA - timeB : timeB - timeA;
  });
}, [projectList, filter.date, filter.sort]); 

  // Select 컴포넌트를 위한 handleChange
  const handleSelectChange = (name: string, value: string) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  async function handleDeleteProject(id: string) {
    // 프로젝트 및 프로젝트 멤버 정보 삭제
    await deleteProject(id);
    await deleteProjectMember(id);
    
    // UI에서 해당 프로젝트 제거
    setProjectList((prevList) => 
      prevList.filter((project) => project.projectId !== id)
    );
    
    showToast("삭제되었습니다.", "deleted");
  }
  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };


  if (loading) {
    return <LoadingSpinner />;
  }
  if (sortedProjectList.length === 0) {
    return (
      <div className="mx-20 mb-10">
         <PorjectCardFilter 
            filter={filter}
            showFilter={showFilter}
            onFilterChange={handleSelectChange}
            onToggleFilter={() => setShowFilter(prev => !prev)}
        />  
      
        <div className="items-center justify-center">
          <div className="flex items-center justify-center pt-50">
            <Button btnType="icon" icon="board" size={18}></Button>
          </div>
          <div className="flex items-center justify-center font-bold text-lg py-1">
            프로젝트 없음
          </div>
          <div className="flex items-center justify-center py-1">
            나만의 첫 프로젝트를 만들어 시작합니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-20 mb-10">
      <PorjectCardFilter 
            filter={filter}
            showFilter={showFilter}
            onFilterChange={handleSelectChange}
            onToggleFilter={() => setShowFilter(prev => !prev)}
        />
      <div className="h-[calc(100vh-340px)] overflow-y-auto">
        <div
          className="
                  grid
                  grid-cols-1
                  sm:grid-cols-1
                  md:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-3
                  2xl:grid-cols-4
                  gap-4"
        >
          {sortedProjectList.map((project, index) => {
            return (
              // 프로젝트 선택 시 칸반보드 이동
              <Card
                key={index}
                className="rounded-md hover:border-main-200 cursor-pointer"
                onClick={() => {
                  onSelectProject?.(project.project_id);
                }}
              >
                <CardHeader className="flex w-full">
                  <CardTitle>{project.projectName}</CardTitle>
                </CardHeader>
                <CardDescription className="flex">
                  <div className="flex gap-2">{project.description}</div>
                </CardDescription>
                <CardContent className="flex justify-end">
                  <div className="flex gap-2 font-bold text-main-400 dark:text-main-200 ">
                    <Icon type="users" size={20} className="text-main-400 dark:text-main-200 " />
                    <div className="text-sm">
                      {projectMember ? projectMember[project.project_id] : 1}팀원
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <div onClick={(e: any) => e.stopPropagation()}>
                    <Link href={`/project/update/${project.projectId}`}>
                      <Button
                        btnType="icon"
                        icon="edit"
                        size={16}
                        variant="white"
                        color="primary"
                        className="
                          hover:bg-main-100/40 
                          hover:border-main-100/40 
                          text-main-400 
                          dark:text-main-200!
                          dark:bg-gray-700!
                          dark:border-gray-500!
                          dark:hover:bg-gray-100/40!"
                      />
                    </Link>
                  </div>
                  <div onClick={(e: any) => e.stopPropagation()}>
                    <DeleteDialog onClick={() => handleDeleteProject(project.projectId)} />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>  
      </div>
      <div className="mt-6">
        <ProjectPagination 
            currentPage={currentPage}
            totalPage={totalPage}
            onPageChange={handlePageChange} 
          />
        </div>
    </div>
  );
}
