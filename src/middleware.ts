import { withAuth } from "next-auth/middleware";
//미들웨어에서는 “세션(session)”이 절대 보이지 않고, 오직 JWT token 만 접근 가능
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const role = token?.role;
    

    // 1) 로그인 안 한 유저 → 로그인 페이지 빼고 모두 접근 불가
    if (!token && pathname !== "/login") {
      return Response.redirect(new URL("/login", req.url));
    }

    // 2) 로그인 한 유저 → 로그인 페이지 접근 불가
    if (token && pathname === "/login") {
      return Response.redirect(new URL("/", req.url));
    
    
    }
    if (pathname.startsWith("/admin")) {
      // 로그인 안 했으면 당연히 접근 불가
      if (!token) {
        return Response.redirect(new URL("/login", req.url));
      }

      // 로그인했지만 role !== admin → 접근 불가
      if (role !== "admin") {
        return Response.redirect(new URL("/", req.url));
      }
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
