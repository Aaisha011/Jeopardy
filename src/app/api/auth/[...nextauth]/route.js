// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,

//   callbacks: {
//     async signIn({ user }) {
//       try {
//         console.log("User signing in:", user);

//         // Assign role based on email
//         const userRole =
//           user.email === "pathanaaisha011@gmail.com" ? "ADMIN" : "USER";

//         // Check if the user exists in the database
//         const existingUser = await prisma.user.findUnique({
//           where: { email: user.email },
//         });

//         if (!existingUser) {
//           const randomPassword = Math.random().toString(36).slice(-8);
//           const hashedPassword = await bcrypt.hash(randomPassword, 10);

//           await prisma.user.create({
//             data: {
//               name: user.name,
//               email: user.email,
//               role: userRole === "ADMIN" ? "admin" : "user",
//               password: hashedPassword,
//             },
//           });
//         }

//         return true;
//       } catch (error) {
//         console.error("Error during sign-in:", error);
//         return false;
//       }
//     },

//     async jwt({ token, account }) {
//       if (account) {
//         token.accessToken = account.access_token;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       const user = await prisma.user.findUnique({
//         where: { email: session.user?.email },
//       });

//       if (user) {
//         session.user.role = user.role;
//       }

//       session.accessToken = token.accessToken;
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider  from "next-auth/providers/google"
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
// const { SupabaseAdapter } = require("@next-auth/supabase-adapter")

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Credentials (Email & Password) Provider
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // Find user in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Check password
        const isValidPassword = await compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error("Incorrect password");
        }

        return user;
      },
    }),
  ],
  
  // Supabase Adapter for managing user sessions
  // adapter: SupabaseAdapter({
  //   url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  //   secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  // }),

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  
  pages: {
    signIn: "/auth/login", // Custom login page
  },

  debug: true,
};

const handler = NextAuth.default(authOptions);
export { handler as GET, handler as POST };



// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/AuthOption";
// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };