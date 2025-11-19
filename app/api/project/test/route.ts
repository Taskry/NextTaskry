let projectList = [
       {
            id: "project01",
            name: "project01",
            type: "개발",
            status: "진행중",
            startedAt:  undefined,
            endedAt:  undefined,
            techStack: "React, Typescript",
            description: "Project01 description"
        },
        {
            id: "project02",
            name: "project02",
            type: "개발",
            status: "진행중",
            startedAt:  undefined,
            endedAt:  undefined,
            techStack: "React, Typescript",
            description: "Project02 description"
        },
        {
            id: "project03",
            name: "project03",
            type: "개발",
            status: "진행중",
            startedAt:  undefined,
            endedAt:  undefined,
            techStack: "React, Typescript",
            description: "Project03 description"
        }
    ]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  let projectData = projectList;

  if (id !== "" && id !== "undefined") {
    const findData = projectList.find(project => project.id === id);
    projectData = findData ? [findData] : [];
  } 

  // 쿼리 실행 [프로젝트 조회]
  const result = { 
    message: `프로젝트[${id}] 정보 조회`,
    params: {
      projectId: id || '파라미터 없음',
    },
    data: projectData,
    timestamp: new Date().toISOString()
  }

  // 결과 반환
  return Response.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const {name, type, status, startedAt, endedAt, techStack, description} = body;

  const createData = {
    id: name,
    name: name,
    type: type,
    status: status,
    startedAt:  startedAt,
    endedAt:  endedAt,
    techStack: techStack,
    description: description,
  }
  projectList.push(createData);

  // 쿼리 실행 [프로젝트 정보 생성]
  const result = {
    message: `프로젝트 정보 생성`,
    receivedData: body,
    timestamp: new Date().toISOString()
  }

  // 결과 반환
  return Response.json(result);
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const body = await request.json();

  const id = searchParams.get('id');  
  const {name, description, type, status, startedAt, endedAt, techStack } = body;

  // find 메서드를 사용하여 해당 id를 가진 프로젝트를 찾습니다.
  const targetProject = projectList.find(project => project.id === id);

  // 프로젝트를 찾았으면 값을 변경합니다.
  if (targetProject) {
      targetProject.name = name;
      targetProject.type = type;
      targetProject.status = status;
      targetProject.startedAt = startedAt;
      targetProject.endedAt = endedAt;
      targetProject.techStack = techStack;
      targetProject.description = description;
  }
  
  // 쿼리 실행 [프로젝트 정보 업데이트]
  const result = {
    message: `프로젝트[${id}] 정보 업데이트`,
    receivedData: body,
    timestamp: new Date().toISOString()
  }

  // 결과 반환
  return Response.json(result);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');  
  
  projectList = projectList.filter(project => project.id !== id);
  console.log(projectList)

  const result = {
    message: `프로젝트[${id}] 정보 삭제`,
    params: {
      projectId: id || '파라미터 없음',
    },
    timestamp: new Date().toISOString()
  }

  // 결과 반환
  return Response.json(result);
}