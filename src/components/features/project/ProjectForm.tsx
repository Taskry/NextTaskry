"use client";

import Button from "@/components/ui/Button";
import { Icon } from "@/components/shared/Icon";
import { Calendar22 } from "@/components/features/project/Calendar";
import { StatusSelect } from "@/components/features/project/StatusSelect";
import { TypeSelect } from "@/components/features/project/TypeSelect";
import { Input } from "@/components/ui/shadcn/Input";
import { Label } from "@/components/ui/shadcn/Label";
import { Textarea } from "@/components/ui/shadcn/Textarea";
import {
  createProject,
  getProjectById,
  getProjectMember,
  updateProject,
  updateProjectMember,
} from "@/lib/api/projects";
import { showToast } from "@/lib/utils/toast";
import { getUser, getUserById } from "@/lib/api/users";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ComboBox, type Item } from "./ComboBox";
import ProjectDateCard from "./ProjectDateCard";
import { RoleSelect } from "./RoleSelect";

interface ProjectProps {
  projectName: string;
  type: string;
  status: string;
  startedAt: Date | undefined;
  endedAt: Date | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  techStack: string;
  description: string;
}

export default function ProjectForm({ id }: { id?: string }) {
  const router = useRouter();
  const [projectData, setProjectData] = useState<ProjectProps>({
    projectName: "",
    type: "",
    status: "",
    startedAt: new Date(),
    endedAt: new Date(),
    createdAt: undefined,
    updatedAt: undefined,
    techStack: "",
    description: "",
  });
  const [user, setUser] = useState<Item | null>(null);
  const [manager, setManager] = useState<Item | null>(null);
  const [userList, setUserList] = useState<Item[]>([]);
  const [projectMember, setProjectMember] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 유저 조회
        const userResult = await getUser();
        if (userResult.data) {
          setUserList(userResult.data.map(({ user_id, user_name, email }) => ({
            id: user_id,
            label: `${user_name} (${email})`,
            value: user_name,
            email,
          })));
        }

        if (!id) {
          return;
        }

        // 프로젝트 정보 및 멤버 조회
        const [projectResult, memberResult] = await Promise.all([
          getProjectById(id),
          getProjectMember(id)
        ]);

        // 프로젝트 데이터 설정
        const project = projectResult.data?.[0];
        if (project) {
          setProjectData({
            ...project,
            projectName: project.project_name,
            startedAt: project.started_at,
            endedAt: project.ended_at,
            createdAt: project.created_at,
            updatedAt: project.updated_at,
            techStack: project.tech_stack,
          });
        }

        // 프로젝트 멤버 데이터 설정
        if (memberResult.data) {
          const memberPromises = memberResult.data.map(async (member) => {
            const { data } = await getUserById("eq", member.user_id);
            const userInfo = data?.[0];
            
            if (!userInfo) {
                return null;
            }

            return {
              projectId: id,
              userId: userInfo.user_id,
              userName: userInfo.user_name,
              email: userInfo.email,
              role: member.role,
            };
          });

          const validMembers = (await Promise.all(memberPromises)).filter(Boolean);
          setProjectMember(validMembers);
        }

      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]); 

  // 일반 Input과 Textarea를 위한 handleChange
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setProjectData((prevProjectData) => ({
      ...prevProjectData,
      [name]: value,
    }));
  };

  // Select 컴포넌트를 위한 handleChange
  const handleSelectChange = (name: string, value: string) => {
    setProjectData((prevProjectData) => ({
      ...prevProjectData,
      [name]: value,
    }));
  };

  // RoleSelect 컴포넌트를 위한 handleChange
  const handleRoleSelectChange = (index: number, value: string) => {
    const newProjectMembers = [...projectMember];
    
    newProjectMembers[index] = { 
      ...newProjectMembers[index], 
      role: value 
    };

    setProjectMember(newProjectMembers);
  };

  // Calendar를 위한 핸들러
  const handleDateChange = (name: string, date: Date | undefined) => {
    setProjectData((prevProjectData) => ({
      ...prevProjectData,
      [name]: date,
    }));
  };

  // 프로젝트 멤버 추가 핸들러
  const handleAddProjectMember = (newItem: Item | null) => {
    if (!newItem) {
      return;
    }
    const isDuplicate = projectMember.some((member) => member.userId === newItem.id);

    if (isDuplicate) {
      alert("이미 추가된 멤버입니다.");
      return; 
    }

    const newMember = {
      projectId: id,
      userId: newItem.id,
      userName: newItem.value,
      email: newItem.email,
      role: "member",
    };
    setProjectMember((prev) => [...prev, newMember]);    
  };

  // 프로젝트 멤버 삭제 핸들러
  const handleDeleteProjectMember = (id: string) => {
    const filterProjectMember = projectMember.filter(member => member.userId !== id);
    setProjectMember(filterProjectMember);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault(); 

    try {
      let targetId = id;

      if (!targetId) {
        const { data } = await createProject(projectData);
        targetId = data?.[0]?.project_id; 
      } else {
        await updateProject(targetId, projectData);
      }

      if (targetId) {
        await updateProjectMember(targetId, projectMember);
      }

      showToast("저장되었습니다.", "success");
      router.push("/");
      
      } catch (error) {
        console.error(error);
        showToast("저장에 실패했습니다.", "error");
      }
  };

  return (
    <div className="mx-30 my-10">
      <div>
        <div className="text-2xl font-bold pb-5">{id ? "프로젝트 수정" : "프로젝트 생성"}</div>
        <div className="py-2">
          <Label className="pb-2 font-bold text-base">프로젝트 명</Label>
          <Input
            id="projectName"
            name="projectName"
            type="text"
            placeholder="프로젝트 명을 입력해주세요"
            value={projectData.projectName}
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

      { id && <ProjectDateCard projectData={projectData}/> }
        
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

        <div className="flex items-center py-2">
          <Label className="font-bold text-base">프로젝트 구성원</Label>
        </div>

        <div className="pb-4">
          <ComboBox items={userList} value={user} setValue={setUser} onChange={handleAddProjectMember}/>
        </div>
        {projectMember.map((member, index) => {
          return (
            <div className="flex pb-6" key={index}>
              <div className="flex items-center w-full">
                <div className="border-1 rounded-full p-3 mr-5 border-gray-100 dark:border-gray-500">
                  <Icon 
                    type="userCircle"
                    className="
                      text-gray-700
                      dark:text-gray-200"
                    />
                </div>
                <div>
                  <div>{member.userName}</div>
                  <div className="flex justify-center items-center">
                    <div className="mr-2"> 
                      {member.email} - 
                    </div>
                    <div>
                      <RoleSelect value={member.role} onValueChange={(value) => handleRoleSelectChange(index, value)} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Button
                  btnType="icon"
                  icon="trash"
                  size={16}
                  className="
                    hover:bg-red-100/40
                    hover:border-red-100/40
                    text-red-100
                    dark:text-red-100/80!
                    dark:bg-gray-700!
                    dark:border-gray-500!
                    dark:hover:bg-gray-100/40!"
                  onClick={() => handleDeleteProjectMember(member.userId)}
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
