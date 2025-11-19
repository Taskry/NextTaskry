import { supabaseServer } from "@/lib/supabase/supabase/server";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일 후 재로그인 필요
  },

  callbacks: {
    async signIn({ user }) {
      // const supabase = supabaseServer;
      const email = user.email;

      if (!email) return false;

      // 1️⃣ 기존 유저 조회
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      // 2️⃣ 기존 유저가 있고, global_role === 'admin'이면 → 관리자 정보만 업데이트만
      if (existingUser?.global_role === "admin") {
        console.log("관리자입니다. ");

        await supabase
          .from("users")
          .update({
            user_name: user.name,
            profile_image: user.image,
            updated_at: new Date().toISOString(),
            is_active: true,
            auth_provider: "google",
          })
          .eq("email", email);

        return true;
      }

      // 3️⃣ 신규 유저라면 INSERT
      if (!existingUser) {
        console.log("신규유저입니다. ");
        await supabase.from("users").insert({
          email: user.email,
          user_name: user.name,
          profile_image: user.image,
          // password: null,              // 소셜 로그인 → 사용 X
          global_role: "user", // 일반 유저
          auth_provider: "google",
          is_active: true,
          updated_at: new Date().toISOString(),
        });

        return true;
      }

      // 4️⃣ 기존 일반 유저라면 UPDATE
      await supabase
        .from("users")
        .update({
          user_name: user.name,
          profile_image: user.image,
          updated_at: new Date().toISOString(),
          is_active: true,
          auth_provider: "google",
        })
        .eq("email", email);

      console.log("기존유저입니다. ");
      return true;
    },

    async jwt({ token, user }) {
      //처음 토큰 생성한 뒤 payload에 유저정보를 브라우저에 세션으로 넘겨주기위한 코드
      // 그 뒤 토큰 검증할때마다 실행될때는 user가 없기때문에 하위 코드는 실행되지않는다.
      if (user) {
        // DB에서 유저 조회
        // const supabase = supabaseServer;
        const { data: existingUser } = await supabase
          .from("users")
          .select("user_id, global_role, user_name, email, profile_image")
          .eq("email", user.email)
          .single();

        if (existingUser) {
          token.user_id = existingUser.user_id;
          token.role = existingUser.global_role;
          token.user_name = existingUser.user_name;
          token.profile_image = existingUser.profile_image;
          token.email = existingUser.email;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.user_id = token.user_id;
        session.user.role = token.role;
        session.user.name = token.user_name;
        session.user.email = token.email;
        session.user.image = token.profile_image;
      }
      return session;
    },
  },

  // callbacks: {
  //   async signIn({user}) {
  //     const {data:existingUser} = await supabase
  //       .from('users')
  //       .select('*')
  //       .eq('oauth_id', user.id)
  //       .single();
  //     if (!existingUser) {
  //       await supabase
  //         .from('users')
  //         .insert({
  //           oauth_id:user.id,
  //           name:user.name,
  //           email: user.email,
  //           data: {points:10000}
  //         })
  //     }
  //     return true
  //   },
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id;  // user.id → JWT에 저장
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (session.user) {
  //       session.user.id = token.id as string;  // JWT → session으로 전달
  //     }
  //     return session;
  //   }
  // },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
