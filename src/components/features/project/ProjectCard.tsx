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
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { showApiError, showToast } from "@/lib/utils/toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { DeleteDialog } from "./DeleteDialog";
import { ViewSelect } from "./ViewSelect";
import { cn } from "@/lib/utils/utils";
import { DateSelect } from "./DateSelect";
import { SortSelect } from "./SortSelect";
import PorjectCardFilter from "./ProjectFilter";

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
    view: "personal",
    date: "startedAt",
    sort: "asc"
  });
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();

   const fetchAllData = async () => {
    try {
      let projectResult = null;
      const userId= await session?.user.user_id;
      // 프로젝트 목록 조회
      if (filter.view === "personal") {
        const memberByUserResult = await getProjectMemberByUser(userId);
        const memberByUserData = memberByUserResult.data;

        if (!memberByUserData) return;

        if (memberByUserData.length === 0) {
          memberByUserData.push({project_id: "00000000-0000-0000-0000-000000000000"})
        }
        const currentIds = memberByUserData.map((memberData) => memberData.project_id).join(',');

        projectResult = await getProjectByIds(currentIds);
      } else {
        projectResult = await getProject();
      }
      
      const data = projectResult.data;

      if (!data) return;

      // 프로젝트 목록 가공
      const formattedProjects = data.map((project) => ({
        ...project,
        projectId: project.project_id,
        projectName: project.project_name,
      }));
      setProjectList(formattedProjects);

      // 각 프로젝트의 멤버 정보 조회
      const memberPromises = formattedProjects.map((p) =>
        getProjectMember(p.projectId)
          .then((res) => ({ id: p.projectId, count: res.data?.length || 0 }))
      );
      
      // 모든 요청이 끝날 때까지 기다림
      const membersResults = await Promise.all(memberPromises);

      // 멤버 정보를 객체 형태로 변환하여 한 번에 업데이트
      const memberMap = membersResults.reduce((acc, cur) => ({
        ...acc,
        [cur.id]: cur.count,
      }), {});
      
      setProjectMember(memberMap);

    } catch (err) {
      console.error(err);
      showApiError("데이터를 불러오는 중 오류가 발생했습니다.");
    }
  };


  useEffect(() => {
    console.log(session?.user.user_id, status)
  }, [status])
  useEffect(() => {
    if (status === "authenticated") {
      fetchAllData();
    }
  }, [filter.view, status]);

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
                        dark:text-main-200 
                        dark:bg-gray-700
                        dark:border-gray-500
                        dark:hover:bg-gray-100/40"
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
  );
}
