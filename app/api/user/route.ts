import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const email = searchParams.get('email');
  const userName = searchParams.get('userName');
  
  // 사용자 인증
  // const session = await getServerSession(authOptions);
  
  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  /*
   // 쿼리 실행 [유저 조회]
  // userId, email, userName 조건에 맞는 유저 조회할 수 있도록 수정
  const { data: users, error: getError } = await supabase
    .from('users')
    .select('*');

  if (getError) {
    console.error('Error fetching users:', getError);
    // Response.json()을 사용하여 에러 응답
    return Response.json({ error: getError.message }, { status: 500 });
  }
  // Response.json()을 사용하여 성공 응답
  return Response.json(users, { status: 200 });
  */ 

  const result = { 
    message: `유저[${id}] 정보 조회`,
    params: {
      userId: id || '파라미터 없음',
      email: email || '파라미터 없음',
      userName: userName || '파라미터 없음',
    },
    timestamp: new Date().toISOString()
  }

  // 결과 반환
  return Response.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const {name, email} = body;

  // 사용자 인증
  // const session = await getServerSession(authOptions);
  
  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  /*
  // 쿼리 실행 [유저 정보 생성]
  const { data: newUser, error: postError } = await supabase
    .from('users')
    .insert([{ name, email }]);

  if (postError) {
    console.error('Error adding user:', postError);
    return Response.json({ error: postError.message }, { status: 500 });
  }
  
  Response.json()을 사용하여 성공 응답
  return Response.json(newUser, { status: 201 });
  */
  
  const result = {
    message: `유저 정보 생성`,
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

  /*
  // 쿼리 실행 [유저 정보 업데이트]
  const { data: updatedUser, error: putError } = await supabase
    .from('users')
    .update({ name: updatedName, email: updatedEmail })
    .eq('id', id);

  if (putError) {
    console.error('Error updating user:', putError);
    return Response.json({ error: putError.message }, { status: 500 });
  }
  if (!updatedUser || updatedUser.length === 0) {
    return Response.json({ message: 'User not found or nothing to update' }, { status: 404 });
  }
  
  // Response.json()을 사용하여 성공 응답
  return Response.json(updatedUser, { status: 200 });
  */
    
  const result = {
    message: `유저[${id}] 정보 업데이트`,
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

  /*
  // 쿼리 실행 [유저 정보 삭제]
  // 아래 예시는 Delete 예시입니다.
  // 실제 동작은 update 함수를 통해서 is_active 값을 변경.
  const { data: deletedUser, error: deleteError } = await supabase
    .from('users')
    .delete()
    .eq('id', deleteId);

  if (deleteError) {
    console.error('Error deleting user:', deleteError);
    return Response.json({ error: deleteError.message }, { status: 500 });
  }
  if (!deletedUser || deletedUser.length === 0) {
    return Response.json({ message: 'User not found' }, { status: 404 });
  }

  // Response.json()을 사용하여 성공 응답
  return Response.json({}, { status: 204 });
  */
  
  const result = {
    message: `유저[${id}] 정보 삭제`,
    params: {
      userId: id || '파라미터 없음',
    },
    timestamp: new Date().toISOString()
  }

  // 결과 반환
  return Response.json(result);
}