"use client";

import Button from "@/app/components/Button/Button";
import { Icon } from "@/app/components/Icon/Icon";
import { Calendar22 } from "@/app/components/project/Calendar";
import { StatusSelect } from "@/app/components/project/StatusSelect";
import { TypeSelect } from "@/app/components/project/TypeSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ProjectProps {
  name: string;
  type: string;
  status: string;
  startedAt: Date | undefined;
  endedAt: Date | undefined;
  techStack: string;
  description: string;
}

export default function ProjectForm({
  projectInfo,
}: {
  projectInfo?: ProjectProps;
}) {
  const [projectData, setProjectData] = useState<ProjectProps>({
    name: "",
    type: "",
    status: "",
    startedAt: new Date(),
    endedAt: new Date(),
    techStack: "",
    description: "",
  });

  useEffect(() => {
    if (projectInfo) {
      const transformData: ProjectProps = {
        ...projectInfo,
        startedAt: projectInfo.startedAt
          ? new Date(projectInfo.startedAt)
          : undefined,
        endedAt: projectInfo.endedAt
          ? new Date(projectInfo.endedAt)
          : undefined,
      };
      setProjectData(transformData);
    }
  }, []);

  useEffect(() => {
    console.log(projectData);
  }, [projectData]);

  const memberList = [
    {
      name: "사용자01",
      email: "user01@domain.com",
      role: "담당자",
    },
    {
      name: "사용자02",
      email: "user02@domain.com",
      role: "팀원",
    },
    {
      name: "사용자03",
      email: "user03@domain.com",
      role: "팀원",
    },
  ];

  // 일반 Input과 Textarea를 위한 handleChange
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setProjectData((prevProjectData) => ({
      ...prevProjectData,
      [name]: value,
    }));
  };

  // Select 컴포넌트를 위한 handleChange (onValueChange 프롭 사용)
  const handleSelectChange = (name: string, value: string) => {
    setProjectData((prevProjectData) => ({
      ...prevProjectData,
      [name]: value,
    }));
  };

  // Calendar를 위한 핸들러 (특정 필드에 날짜를 저장)
  const handleDateChange = (name: string, date: Date | undefined) => {
    setProjectData((prevProjectData) => ({
      ...prevProjectData,
      [name]: date, // 'birthDate' 필드에 Date 객체 저장
    }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    alert(`프로젝트 데이터: \n${JSON.stringify(projectData, null, 2)}`);
    console.log(projectData);
  };

  return (
    <div className="mx-30 my-10">
      <div>
        <div className="text-2xl font-bold pb-5">프로젝트 생성</div>

        <div className="py-2">
          <Label className="pb-2 font-bold text-base">프로젝트 명</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="프로젝트 명을 입력해주세요"
            value={projectData.name}
            onChange={handleChange}
          />
        </div>

        <div className="flex py-2 grid grid-cols-2 gap-4">
          <div>
            <Label className="pb-2 font-bold text-base">프로젝트 분류</Label>
            <TypeSelect
              value={projectData.type}
              onValueChange={(value) => {
                handleSelectChange("type", value);
              }}
            />
          </div>
          <div>
            <Label className="pb-2 font-bold text-base">프로젝트 상태</Label>
            <StatusSelect
              value={projectData.status}
              onValueChange={(value) => {
                handleSelectChange("status", value);
              }}
            />
          </div>
        </div>

        <div className="flex py-2 grid grid-cols-2 gap-4">
          <div>
            <Label className="pb-2 font-bold text-base">프로젝트 시작일</Label>
            <Calendar22
              value={projectData.startedAt}
              onValueChange={(value) => {
                handleDateChange("startedAt", value);
              }}
            />
          </div>
          <div>
            <Label className="pb-2 font-bold text-base">프로젝트 종료일</Label>
            <Calendar22
              value={projectData.endedAt}
              onValueChange={(value) => {
                handleDateChange("endedAt", value);
              }}
            />
          </div>
        </div>

        <div className="py-2">
          <Label className="pb-2 font-bold text-base">프로젝트 기술 스택</Label>
          <Input
            id="techStack"
            name="techStack"
            type="text"
            placeholder="쉼표(,)를 구분해 입력해주세요 예) React, TypeScript"
            value={projectData.techStack}
            onChange={handleChange}
          />
        </div>

        <div className="py-2">
          <Label className="pb-2 font-bold text-base">프로젝트 설명</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="프로젝트 설명을 입력해주세요. (최대 300자)"
            value={projectData.description}
            onChange={handleChange}
          />
        </div>

        <div className="py-2">
          <Label className="pb-2 font-bold text-base">프로젝트 구성원</Label>
        </div>

        {memberList.map((member, index) => {
          return (
            <div className="flex pb-6" key={index}>
              <div className="flex items-center w-full">
                <div className="border-1 rounded-full p-3 mr-5">
                  <Icon type="userCircle" className="text-gray-700!" />
                </div>
                <div>
                  <div>{member.name}</div>
                  <div>
                    {member.email} - {member.role}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {/* <Button
                  icon="trash"
                  radius="full"
                  size="full"
                  variant="lightRed40"
                  textColor="lightRed100"
                  className="hover:cursor-pointer"
                  onClick={() => alert(member.name + "삭제 모달")}
                ></Button> */}
                <Button
                  btnType="icon"
                  icon="trash"
                  size={16}
                  color="red"
                  variant="white"
                  className="hover:bg-red-100/40 hover:border-red-100/40"
                  onClick={() => alert(member.name + "삭제 모달")}
                />
              </div>
            </div>
          );
        })}

        <div className="py-2 justify-self-center">
          <Button
            radius="xl"
            icon="edit"
            variant="bgMain500"
            textColor="white"
            iconSize="sm"
            size="base"
            className="hover:cursor-pointer"
            onClick={handleSubmit}
          >
            {projectInfo ? "수정 완료" : "프로젝트 생성"}
          </Button>
        </div>
        <div className="py-2 justify-self-center">
          <Link href={"/project/dashboard"}>
            <Button
              radius="xl"
              variant="bgMain500"
              textColor="white"
              iconSize="sm"
              size="base"
              className="hover:cursor-pointer"
            >
              홈으로
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
