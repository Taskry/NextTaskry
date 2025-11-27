// import ProjectForm from "@/components/features/project/ProjectForm";
    
export default async function UpdateProject({params}:{params:Promise<{id:string}>}) {
    const {id} = await params;

    // id를 통해서 프로젝트 API 요청 작성
    return (
    <div>
        {/* <ProjectForm id={id}/> */}
    </div>
    );
}