export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || 'all';
  
  // 사용자 인증
  // const session = await getServerSession(authOptions);
  
  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  // 쿼리 실행 [공지사항 조회]
  const result = { 
    message: `공지사항[${id}] 정보 조회`,
    params: {
      announcementId: id || '파라미터 없음',
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

  // 쿼리 실행 [공지사항 생성]
  const result = {
    message: `공지사항 생성`,
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
  const { data } = body;
  
  // 사용자 인증
  // const session = await getServerSession(authOptions);
  
  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  // 쿼리 실행 [공지사항 업데이트]
  const result = {
    message: `공지사항[${id}] 정보 업데이트`,
    receivedData: body,
    timestamp: new Date().toISOString()
  }

  // 결과 반환
  return Response.json(result);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');  
  
  // 사용자 인증
  // const session = await getServerSession(authOptions);
  
  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }
  
  // 쿼리 실행 [공지사항 삭제]
  const result = {
    message: `공지사항[${id}] 삭제`,
    params: {
      announcementId: id || '파라미터 없음',
    },
    timestamp: new Date().toISOString()
  }

  // 결과 반환
  return Response.json(result);
}