import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // 1) 로그인 안 한 유저 → 로그인 페이지 빼고 모두 접근 불가
    if (!token && pathname !== "/login") {
      return Response.redirect(new URL("/login", req.url));
    }

    // 2) 로그인 한 유저 → 로그인 페이지 접근 불가
    if (token && pathname === "/login") {
      return Response.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: () => true, // 모든 요청을 검사하도록 설정
    },
  }
);

export const config = {
  matcher: [
    "/login",
    "/((?!_next|api|favicon.ico).*)", // 내부 리소스 제외하고 전체 감시
  ],
};
