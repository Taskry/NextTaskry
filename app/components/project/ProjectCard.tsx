"use client";

import Button from "@/app/components/Button/Button";
import { Icon } from "@/app/components/Icon/Icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/project/Card";
import { deleteProject, getProject, getProjectMember, updateProject } from "@/lib/projectAPI";
import Link from "next/link";
import { useState, useEffect } from "react";
import { showApiError, showToast } from "@/lib/toast";
import LoadingSpinner from "../loading/LoadingSpinner";

interface ProjectCardProps {
  onSelectProject?: (projectId: string) => void;
}

export default function ProjectCard({ onSelectProject }: ProjectCardProps) {
  const [projectList, setProjectList] = useState<any[]>([]);
  const [projectMember, setProjectMember] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProject = async () => {
    try {
      const result = await getProject();
      const data = result.data;
      
      if (data) {
        const updatedProjects = data.map((project) => ({
          ...project,
          projectId: project.project_id,
          projectName: project.project_name
        }));
        console.log(updatedProjects)
        setProjectList(updatedProjects);
      }      
    } catch (err) {
      console.error(err);
      showApiError("프로젝트 목록을 불러올 수 없습니다.");
    }
  };

  const fetchProjectMember = async (id:string) => {
    try {
      const result = await getProjectMember(id);
      const data = result.data;

      setProjectMember((prev:any) => ({
        ...prev,
        [id]: data?.length
      }));
      return 
    } catch (err) {
      console.error(err);
      showApiError("프로젝트 목록을 불러올 수 없습니다.");
    }
  };
  
  useEffect(() => {
    // setLoading(true);
    fetchProject();
  }, []);

  useEffect(() => {
    for (let index in projectList) {
      const id = projectList[index].id;
      fetchProjectMember(id);
    }

  }, [projectList]);

  // useEffect(() => {
  //   console.log(projectMember);
  // }, [projectMember]);

  async function handleDeleteProject (id:string) {
    await deleteProject(id);
    await fetchProject();
    showToast("삭제되었습니다.", 'deleted');
  }

  if (loading) {
    return <LoadingSpinner />
  }
  if (projectList.length === 0) {
    return (
      <div className="mx-20 my-10">
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
    <div className="mx-20 my-10">
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
        {projectList.map((project, index) => {
          return (
            <Card
              key={index}
              className="rounded-md hover:border-main-200 cursor-pointer"
              onClick={() => {
                console.log("카드 클릭됨:", project);
                onSelectProject?.(project.id);
              }}
            >
              <CardHeader className="flex w-full">
                <CardTitle>{project.projectName}</CardTitle>
              </CardHeader>
              <CardDescription className="flex">
                <div className="flex gap-2">{project.description}</div>
              </CardDescription>
              <CardContent className="flex justify-end">
                <div className="flex gap-2 font-bold text-main-400">
                  <Icon type="users" size={20} className="text-main-400" />
                  <div className="text-sm">{projectMember ? projectMember[project.name] : 1}팀원</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <div onClick={(e) => e.stopPropagation()}>
                  <Link href={`/project/update/${project.projectId}`}>
                    <Button
                      btnType="icon"
                      icon="edit"
                      size={16}
                      variant="white"
                      color="primary"
                      className="hover:bg-main-100/40 hover:border-main-100/40 text-main-400"
                    />
                  </Link>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <Button
                    btnType="icon"
                    icon="trash"
                    size={16}
                    variant="white"
                    color="red"
                    className="hover:bg-red-100/40 hover:border-red-100/40"
                    onClick={() => handleDeleteProject(project.projectId)}
                  />
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

