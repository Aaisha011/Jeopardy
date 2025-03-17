"use client";


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/utils/validationSchema";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export default function SignupForm() {
  const [message, setMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const handleSignup = async (userData) => {
    if (!captchaValue) {
      toast.error("CAPTCHA verification failed!");
      return;
    }
  
    try {
      // Verify CAPTCHA with backend
      const captchaResponse = await axios.post("/api/verify-captcha", { captcha: captchaValue });
  
      if (!captchaResponse.data.success) {
        toast.error("CAPTCHA verification failed!");
        return;
      }
  
      // Proceed with signup if CAPTCHA is valid
      const response = await axios.post("/api/signup", userData);
      toast.success("User has registered successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Signup failed");
    }
  };
  
  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/auth/board" });
  };

  if (!isClient) return null;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-r from-gray-300 to-purple-600">
      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md p-8 bg-opacity-10 backdrop-blur-lg rounded-2xl border-2 border-white/30 shadow-lg shadow-gray-300">
        <h2 className="text-white text-3xl font-semibold text-center mb-6">Create an Account</h2>

        <form onSubmit={handleSubmit(handleSignup)} className="flex flex-col gap-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-black" size={20} />
            <input {...register("name")} type="text" placeholder="Name" className="w-full p-3 pl-10 rounded-lg bg-white/20 text-black placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-400" required />
            {errors.name && <p className="text-red-700 text-md mt-1">{errors.name.message}</p>}
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-black" size={20} />
            <input {...register("email")} type="email" placeholder="Email" className="w-full p-3 pl-10 rounded-lg bg-white/20 text-black placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-400" required />
            {errors.email && <p className="text-red-700 text-md mt-1">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-black" size={20} />
            <input {...register("password")} type="password" placeholder="Password" className="w-full p-3 pl-10 rounded-lg bg-white/20 text-black placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-400" required />
            {errors.password && <p className="text-red-700 text-md mt-1">{errors.password.message}</p>}
          </div>

          {/* Google reCAPTCHA */}
          <ReCAPTCHA
            sitekey= {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={(value) => setCaptchaValue(value)}
          />

          <button type="submit" className="mt-4 bg-blue-500 text-white hover:bg-blue-700 py-3 rounded-lg text-lg font-medium transition-transform transform hover:scale-105">Sign Up</button>
          <p className="text-center text-white">OR</p>
        </form>

        <div className="text-center mt-4">
          <button onClick={handleGoogleLogin} className="flex items-center justify-center w-full bg-white text-black font-medium py-3 rounded-lg shadow-md hover:bg-blue-500 hover:text-white transition-transform transform hover:scale-105">
            <img src="/google.png" alt="Google" className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>
        </div>

        <p className="mt-4 text-white text-center">
          Already have an account? <Link href="/auth/login" className="text-blue-700 underline hover:text-blue-500 transition-colors">Log in</Link>
        </p>
        
        {message && <p className={`mt-2 text-center ${message === "Signup failed" ? "text-red-700" : "text-green-700"}`}>{message}</p>}
      </div>
    </div>
  );
}
