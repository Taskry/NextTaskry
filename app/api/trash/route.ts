export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || 'all';
  
  // 사용자 인증
  // const session = await getServerSession(authOptions);
  
  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  // 쿼리 실행 [휴지통 조회]
  // 삭제된 항목 조회할 수 있는 기능이 필요할 경우?
  const result = { 
    message: `휴지통[${id}] 정보 조회`,
    params: {
      projectMemoId: id || '파라미터 없음',
    },
    timestamp: new Date().toISOString()
  }

  // 결과 반환
  return Response.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();

  // 사용자 인증
  // const session = await getServerSession(authOptions);
  
  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  // 쿼리 실행 [휴지통 정보 생성]
  const result = {
    message: `삭제 항목 휴지통으로 이동`,
    receivedData: body,
    timestamp: new Date().toISOString()
  }

  // 결과 반환
  return Response.json(result);
}

// export async function PUT(request: Request) {
  // const { searchParams } = new URL(request.url);
  // const body = await request.json();

  // const id = searchParams.get('id');  
  // const { data } = body;

//   // 사용자 인증
//   const session = await getServerSession(authOptions);
  
//   if (!session?.user) {
//     return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
//   }
  
//   // 쿼리 실행 [프로젝트 메모 정보 업데이트]
//   const result = {
//     message: `프로젝트 메모[${id}] 정보 업데이트`,
//     receivedData: body,
//     timestamp: new Date().toISOString()
//   }

//   // 결과 반환
//   return Response.json(result);
// }

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');  
  
  // 사용자 인증
  // const session = await getServerSession(authOptions);
  
  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  // 쿼리 실행 [휴지통 정보 삭제]
  // 복원 시 사용 가능성 있음.
  const result = {
    message: `휴지동[${id}] 정보 삭제`,
    params: {
      trashId: id || '파라미터 없음',
    },
    timestamp: new Date().toISOString()
  }

  // 결과 반환
  return Response.json(result);
}