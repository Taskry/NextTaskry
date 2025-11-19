import NextAuth from "next-auth"

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     }
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//   }
// }


import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      user_id: string;
      role: string;
      name: string;
      email: string;
      image: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user_id: string;
    role: string;
    user_name: string;
    email: string;
    profile_image: string;
  }
}