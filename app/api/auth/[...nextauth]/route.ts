
import { supabase } from "@/lib/supabase";
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleAuthProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleAuthProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30일 후 재로그인 필요
  },
  callbacks: {
    async signIn({user}) {
      const {data:existingUser} = await supabase
        .from('users')
        .select('*')
        .eq('oauth_id', user.id)
        .single();
      if (!existingUser) {
        await supabase
          .from('users')
          .insert({
            oauth_id:user.id,
            name:user.name,
            email: user.email,
            data: {points:10000}
          })
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;  // user.id → JWT에 저장
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;  // JWT → session으로 전달
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };