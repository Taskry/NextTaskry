import ProjectForm from "@/app/components/project/ProjectForm";

    
export default async function UpdateProject({params}:{params:Promise<{id:string}>}) {
    const {id} = await params;

    // 테스트 데이터
    const projectInfo = {
        name: id,
        type: "개발",
        status: "계획중",
        startedAt: new Date(),
        endedAt: new Date(),
        techStack: "React, TypeScript",
        description: `${id} 설명문`,
    }

    // id를 통해서 프로젝트 API 요청 작성
    return (
    <div>
        <ProjectForm projectInfo={projectInfo}/>
    </div>
    );
}