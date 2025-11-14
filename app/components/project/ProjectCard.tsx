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
import { getProject } from "@/lib/projectAPI";
import Link from "next/link";
import { useState, useEffect } from "react";
import { showApiError } from "@/lib/toast";

interface ProjectCardProps {
  onSelectProject?: (projectId: string) => void;
}

export default function ProjectCard({ onSelectProject }: ProjectCardProps) {
  const [projectList, setProjectList] = useState<any[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const result = await getProject();
        const data = result.data;

        if (data) {
          setProjectList(data);
        }
      } catch (err) {
        console.error(err);
        showApiError("프로젝트 목록을 불러올 수 없습니다.");
      }
    };
    fetchProject();
  }, []);

  useEffect(() => {
    console.log(projectList);
  }, [projectList]);

  if (projectList.length === 0) {
    return (
      <div className="mx-20 my-10">
        <div className="items-center justify-center">
          <div className="flex items-center justify-center pt-50">
            <Button
              icon="board"
              radius="full"
              size="full"
              variant="lightMain40"
              textColor="txtMain600"
            ></Button>
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
      <div className="flex justify-between">
        <div>
          <div className="text-2xl font-bold p-1">내 프로젝트 목록</div>
          <div className="p-1">Taskry에서 프로젝트를 생성하고 관리합니다</div>
        </div>
        <div className="p-1 content-center">
          <Link href={"/project/create"}>
            <Button
              radius="xl"
              icon="plus"
              variant="bgMain500"
              textColor="white"
              iconSize="sm"
              size="base"
              className="hover:cursor-pointer"
            >
              새 프로젝트
            </Button>
          </Link>
        </div>
      </div>
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
                  <div className="text-sm">4팀원</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <div onClick={(e) => e.stopPropagation()}>
                  <Link href={`/project/update/${project.id}`}>
                    <Button
                      icon="edit"
                      radius="full"
                      size="full"
                      variant="lightMain40"
                      className="hover:cursor-pointer"
                    ></Button>
                  </Link>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <Button
                    icon="trash"
                    radius="full"
                    size="full"
                    variant="lightRed40"
                    textColor="lightRed100"
                    className="hover:cursor-pointer"
                    onClick={() => alert("프로젝트 삭제 모달")}
                  ></Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
