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

interface ProjectProps {
  projectName: string;
  type: string;
  status: string;
  startedAt: Date | undefined;
  endedAt: Date | undefined;
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
    techStack: "",
    description: "",
  });
  const [user, setUser] = useState<Item | null>(null);
  const [userList, setUserList] = useState<Item[]>([]);
  const [projectMember, setProjectMember] = useState<any[]>([]);

  const fetchProject = async () => {
    try {
      if (id) {
        const result = await getProjectById(id);
        const data = result.data;

        if (data) {
          const projectInfo = data[0];
          const projectData = {
            ...projectInfo,
            projectName: projectInfo.project_name,
            startedAt: projectInfo.started_at,
            endedAt: projectInfo.ended_at,
            techStack: projectInfo.tech_stack,
          };
          setProjectData(projectData);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserList = async () => {
    try {
      const result = await getUser();
      const data = result.data;

      if (data) {
        const userData = data.map((user) => ({
          id: user.user_id,
          label: `${user.user_name} (${user.email})`,
          value: user.user_name,
          email: user.email,
        }));
        setUserList(userData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjectMember = async () => {
    try {
      const result = await getProjectMember(id);
      const data = result.data;

      if (data) {
        const memberData = await Promise.all(data.map(async (member) => {
          const userId = member.user_id;
          const userData = await getUserById("eq", userId);
          const userInfo = userData.data?.[0];

          if (!userInfo) return []; 

          return {
            projectId: id,
            userId: userInfo.user_id,
            userName: userInfo.user_name,
            email: userInfo.email,
            role: member.role
          };
        }));
        
        setProjectMember(memberData);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchProject();
    fetchUserList();
    if (id) {
      fetchProjectMember();
    }
    
  }, []);

  //  useEffect(() => {
  //     console.log(projectData)
  // },[projectData])

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

  const handleDeleteProjectMember = (id: string) => {
    const filterProjectMember = projectMember.filter(member => member.userId !== id);
    setProjectMember(filterProjectMember);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    let createdId = null;
    if (id) {
      await updateProject(id, projectData);
    } else {
      const res = await createProject(projectData);
      createdId = res.data?.[0].project_id
    }

    const projectId = createdId? createdId : id;
    await updateProjectMember(projectId, projectMember);
    showToast("저장되었습니다.", "success");
    router.push("/");
  };

  return (
    <div className="mx-30 my-10 min-h-screen">
      <div>
        <div className="text-2xl font-bold pb-5">프로젝트 생성</div>
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
        <div className="py-2">
          <ComboBox items={userList} value={user} setValue={setUser} onChange={handleAddProjectMember}/>
        </div>
        {projectMember.map((member, index) => {
          return (
            <div className="flex pb-6" key={index}>
              <div className="flex items-center w-full">
                <div className="border-1 rounded-full p-3 mr-5">
                  <Icon type="userCircle" className="text-gray-700!" />
                </div>
                <div>
                  <div>{member.userName}</div>
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
