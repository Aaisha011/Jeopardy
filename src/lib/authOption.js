import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        console.log("User signing in:", user);
        const userRole = user.email === "pathanaaisha011@gmail.com" ? "ADMIN" : "USER";

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          const randomPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          await prisma.user.create({
            data: {
              name: user.name,
              email: user.email,
              role: userRole === "ADMIN" ? "admin" : "user",
              password: hashedPassword,
              image: user.image || null, // Check if image exists
            },
          });
        } else {
          if (existingUser.role !== userRole) {
            await prisma.user.update({
              where: { email: user.email },
              data: { role: userRole },
            });
          }
        }

        return true;
      } catch (error) {
        console.error("Error saving user:", error);
        return false;
      }
    },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email },
      });
      if (user) {
        session.user.role = user.role; // Store user role in session
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
