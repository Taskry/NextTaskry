export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "all";

  const result = {
    message: `캔반보드[${id}] 정보 조회`,
    params: {
      boardId: id || "파라미터 없음",
    },
    timestamp: new Date().toISOString(),
  };

  return Response.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();

  const result = {
    message: `캔반보드 정보 생성`,
    receivedData: body,
    timestamp: new Date().toISOString(),
  };

  return Response.json(result);
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const body = await request.json();

  const id = searchParams.get("id");

  const result = {
    message: `캔반보드[${id}] 정보 업데이트`,
    receivedData: body,
    timestamp: new Date().toISOString(),
  };

  return Response.json(result);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const result = {
    message: `캔반보드[${id}] 정보 삭제`,
    params: {
      boardId: id || "파라미터 없음",
    },
    timestamp: new Date().toISOString(),
  };

  return Response.json(result);
}
