"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/utils/validationSchema";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import { signIn, getSession } from "next-auth/react";

export default function LoginForm() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      
      // If signIn returned an error, show it
      if (result?.error) {
        setMessage(result.error);
        return;
      }

      // Wait for the session to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      const session = await getSession();

      if (!session || !session.user) {
        setMessage("Session not found. Please try again.");
        return;
      }

      console.log("Session data:", session);
      
      const id = session.user.id; // Make sure your NextAuth callbacks include this field
      const role = session.user.role; // Ensure that the role is added via callbacks
      const type = session.user.subscriptionType;

      console.log("User ID:", id);
      console.log("User Role:", role);
      console.log("User Type:", type);
      let redirectUrl = '/auth/board';
      if (role === 'admin') {
        redirectUrl = '/auth/admin';
      }

      router.push(redirectUrl);
    } catch (error) {
      console.error('Error signing in:', error);
      setMessage("An error occurred during sign in. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen min-w-screen text-black items-center justify-center bg-gradient-to-r from-gray-300 to-purple-600">
      <div className="w-full max-w-md p-8 bg-opacity-10 backdrop-blur-lg rounded-2xl border-2 border-white/30 shadow-lg shadow-gray-300">
        <h2 className="text-white text-3xl font-semibold text-center mb-6">Login to Jeopardy</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-black opacity-75" size={20} />
            <input
              {...register("email")}
              placeholder="Email"
              className="w-full p-3 pl-10 rounded-lg bg-white/30 text-black placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.email && <p className="text-red-700 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-black opacity-75" size={20} />
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="text-black w-full p-3 pl-10 rounded-lg bg-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.password && <p className="text-red-700 text-sm mt-1">{errors.password.message}</p>}
          </div>
          
          <div className="text-right text-blue-700 hover:text-blue-500">
            <Link href={'/auth/password/forgotPassword'}>Forgot password</Link>
          </div>

          <button 
            type="submit" 
            className="mt-4 bg-blue-500 text-white py-3 rounded-lg text-lg font-medium transition-transform transform hover:scale-105"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-white text-center">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-700 underline hover:text-blue-500 transition-colors">
            Register
          </Link>
        </p>

        {message && (
          <p className={`mt-2 text-center ${message === "error.message" ? "text-red-700" : "text-green-700"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
