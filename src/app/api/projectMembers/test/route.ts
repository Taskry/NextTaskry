let projectMemberList = [
  {
    id: "project01",
    user: "user01",
    email: "user01@domain.com",
    role: "leader",
  },
  {
    id: "project01",
    user: "user02",
    email: "user02@domain.com",
    role: "member",
  },
  {
    id: "project01",
    user: "user03",
    email: "user03@domain.com",
    role: "member",
  },
  {
    id: "project02",
    user: "user01",
    email: "user01@domain.com",
    role: "leader",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const findData = projectMemberList.filter(
    (projectMember) => projectMember.id === id
  );

  // console.log(projectMemberList)
  // console.log(findData)

  // 쿼리 실행 [프로젝트 조회]
  const result = {
    message: `프로젝트 멤버[${id}] 정보 조회`,
    params: {
      projectId: id || "파라미터 없음",
    },
    data: findData,
    timestamp: new Date().toISOString(),
  };

  // 결과 반환
  return Response.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { id, user, email, role } = body;

  const newData = {
    id: id,
    user: user,
    email: email,
    role: role,
  };
  projectMemberList.push(newData);

  // 쿼리 실행 [프로젝트 정보 생성]
  const result = {
    message: `프로젝트 멤버 생성`,
    receivedData: body,
    timestamp: new Date().toISOString(),
  };

  // 결과 반환
  return Response.json(result);
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const body = await request.json();

  const id = searchParams.get("id");
  const { user, email, role } = body;

  // find 메서드를 사용하여 해당 id를 가진 프로젝트를 찾습니다.
  const targetProject = projectMemberList.find(
    (projectMember) => projectMember.id === id
  );

  // // 프로젝트를 찾았으면 값을 변경합니다.
  if (targetProject) {
    targetProject.user = user;
    targetProject.email = email;
    targetProject.role = role;
  }

  // 쿼리 실행 [프로젝트 정보 업데이트]
  const result = {
    message: `프로젝트 멤버[${id}] 정보 업데이트`,
    receivedData: body,
    timestamp: new Date().toISOString(),
  };

  // 결과 반환
  return Response.json(result);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // console.log(id)
  projectMemberList = projectMemberList.filter(
    (projectMember) => projectMember.user !== id
  );
  // console.log(projectMemberList)

  const result = {
    message: `프로젝트 멤버[${id}] 정보 삭제`,
    params: {
      projectId: id || "파라미터 없음",
    },
    timestamp: new Date().toISOString(),
  };

  // 결과 반환
  return Response.json(result);
}
