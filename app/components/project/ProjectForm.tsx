"use client";

import Button from "@/app/components/Button/Button";
import { Icon } from "@/app/components/Icon/Icon";
import { Calendar22 } from "@/app/components/project/Calendar";
import { StatusSelect } from "@/app/components/project/StatusSelect";
import { TypeSelect } from "@/app/components/project/TypeSelect";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/UI/textarea";
import {
  addProjectMember,
  createProject,
  deleteProjectMember,
  getProject,
  getProjectMember,
  updateProject,
} from "@/lib/projectAPI";
import { useRouter } from "next/navigation";
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

interface ProjectMemberProps {
  user: string;
  email: string;
  role: string;
}

export default function ProjectForm({ id }: { id?: string }) {
  const router = useRouter();
  const [projectData, setProjectData] = useState<ProjectProps>({
    name: "",
    type: "",
    status: "",
    startedAt: new Date(),
    endedAt: new Date(),
    techStack: "",
    description: "",
  });
  const [projectMember, setProjectMember] = useState<ProjectMemberProps[]>([]);

  const fetchProject = async () => {
    try {
      const result = await getProject(id);
      const data = result.data;

      if (data) {
        setProjectData(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjectMember = async () => {
    try {
      const result = await getProjectMember(id);
      const data = result.data;

      console.log(data);

      if (data) {
        setProjectMember(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
      fetchProjectMember();
    }
  }, []);

  useEffect(() => {
    console.log(projectData);
  }, [projectData]);

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
      [name]: date,
    }));
  };

  const handleAddProjectMember = () => {
    const newData = {
      id: id,
      user: `user0${projectMember.length + 1}`,
      email: `user0${projectMember.length + 1}@domail.com`,
      role: "member",
    };

    addProjectMember(newData);
    setProjectMember((prev) => [...prev, newData]);
  };

  const handleDeleteProjectMember = (id: string) => {
    deleteProjectMember(id);
    fetchProjectMember();
  };

  const handleSubmit = (event: any) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    if (id) {
      updateProject(projectData.name, projectData);
    } else {
      createProject(projectData);
      projectMember.map((member) => {
        const data = {
          ...member,
          id: projectData.name,
        };
        addProjectMember(data);
      });
    }
    router.push("/project/dashboard");
  };

  return (
    <div className="mx-30 my-10 min-h-screen">
      <div>
        <div className="text-2xl font-bold pb-5">프로젝트 생성</div>`{" "}
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
        <div className="py-2 grid grid-cols-2 gap-4">
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
        `
        <div className="flex items-center py-2">
          <Label className="pb-2 font-bold text-base">프로젝트 구성원</Label>
          <Button
            btnType="icon"
            icon="plus"
            size={16}
            variant="primary"
            color="white"
            className="hover:cursor-pointer mx-2"
            onClick={handleAddProjectMember}
          ></Button>
        </div>
        {projectMember.map((member, index) => {
          return (
            <div className="flex pb-6" key={index}>
              <div className="flex items-center w-full">
                <div className="border-1 rounded-full p-3 mr-5">
                  <Icon type="userCircle" className="text-gray-700!" />
                </div>
                <div>
                  <div>{member.user}</div>
                  <div>
                    {member.email} - {member.role}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Button
                  btnType="icon"
                  icon="trash"
                  size={16}
                  color="red"
                  variant="white"
                  className="hover:bg-red-100/40 hover:border-red-100/40"
                  onClick={() => handleDeleteProjectMember(member.user)}
                />
              </div>
            </div>
          );
        })}
        <div className="py-2 justify-self-center absolute bottom-5 left-1/2 transform -translate-x-1/2">
          <Button
            icon="edit"
            variant="primary"
            size={16}
            className="hover:cursor-pointer mr-2 text-white"
            onClick={handleSubmit}
          >
            {id ? "수정 완료" : "프로젝트 생성"}
          </Button>
        </div>
      </div>
    </div>
  );
}
