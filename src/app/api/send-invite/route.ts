import { NextResponse } from "next/server";
import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, invitationId } = await req.json();

    if (!email || !invitationId) {
      return NextResponse.json(
        { error: "필수 데이터가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 초대 수락 링크
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login?invite=${invitationId}`;

    const result = await resend.emails.send({
      from: "Taskry <onboarding@resend.dev>",
      to: email,
      subject: "Taskry 프로젝트 초대",
      html: `
        <h2>Taskry 프로젝트에 초대되었습니다!</h2>
        <p>아래 버튼을 눌러 로그인 후 초대를 수락하세요.</p>
        <a href="${inviteUrl}" 
           style="display:inline-block;padding:12px 20px;background:#4a6cf7;color:white;border-radius:8px;text-decoration:none;">
          초대 수락하기
        </a>
      `,
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return NextResponse.json({ error: "이메일 전송 실패" }, { status: 500 });
  }
}