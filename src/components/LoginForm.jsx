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
// import { signIn, useSession } from "next-auth/react";


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


  // const handleGoogleLogin = () => {
  //     signIn("google", { callbackUrl: "/auth/board" });   
  //     console.log("Google login clicked"); 
  // };
  
  
  
  // const onSubmit = async (User) => {
  //   try {
  //     console.log("Submitting User:", User);
  
  //     // Make the login request to the backend
  //     const response = await axios.post("/api/login", User);
  //     console.log("API Response:", response.data);
  
  //     // Display success message
  //     setMessage(response.data.message);
  
  //     // Store token securely
  //     const token = response.data.token; // Get token from the response
  //     localStorage.setItem("token", token); // Store token in localStorage
  //     console.log("Token stored in localStorage:", token);
  
  //     // Redirect based on user role
  //     const userRole = response.data.user.role;
  //     if (userRole === "admin") {
  //       router.push("/auth/admin"); // Redirect to admin dashboard
  //     } else {
  //       router.push("/auth/board"); // Redirect to user board
  //     }
  //   } catch (error) {
  //     console.error("Error during login:", error.response?.data || error.message || error);
    
  //     // Set a fallback error message
  //     setMessage(
  //       error.response?.data?.message || "Something went wrong. Please try again."
  //     );
  //   }
  // };

  const onSubmit = async (data) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });
  
      if (result?.ok) {
        // Wait for session to update before fetching it
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        
        const session = await getSession();
        console.log("Session data:", session);  // Debugging
        
        const id = session?.user?.id;  // Ensure id exists
        console.log("User ID:", id); 
  
        const role = session?.user?.role;  // Ensure role exists
        console.log("User Role:", role); 
  
        let redirectUrl = '/auth/board';
        if (role === 'admin') {
          redirectUrl = '/auth/admin';
        }
  
        router.push(redirectUrl);
      } else {
        console.error('Sign-in error', result?.error);
      }
    } catch (error) {
      console.error('Error signing in', error);
    }
  };
  
  return (
    <div className="flex min-h-screen min-w-screen text-black items-center justify-center bg-gradient-to-r from-gray-300 to-purple-600">
      <div className="w-full max-w-md p-8  bg-opacity-10 backdrop-blur-lg rounded-2xl border-2 border-white/30 shadow-lg shadow-gray-300">
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

          <button 
            type="submit" 
            className="mt-4 bg-blue-500 text-white py-3 rounded-lg text-lg font-medium transition-transform transform hover:scale-105"
          >
            Login
          </button>
          {/* <p className="text-center text-white">OR</p> */}

        </form>
        {/* Google Login Button */}
        {/* <div className="text-center mt-4">
          <button 
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full bg-white text-black font-medium py-3 rounded-lg shadow-md hover:bg-blue-500 hover:text-white transition-transform transform hover:scale-105"
          >
            <img src="/google.png" alt="Google" className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>
        </div> */}

        <p className="mt-4 text-white text-center">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-700 underline hover:text-blue-500 transition-colors">
            Register
          </Link>
        </p>

        {message && (
          <p
            className={`mt-2 text-center ${
              message === "error.message" ? "text-red-700" : "text-green-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
