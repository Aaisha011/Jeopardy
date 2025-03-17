"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-gray-400 to-purple-500 text-white">
      {/* Title with Animation */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-6xl font-extrabold mb-4 text-center"
      >
        Welcome to <span className="text-gray-700">Jeopardy!</span>
      </motion.h1>

      {/* Subtitle with Fade-in Effect */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="text-lg text-gray-200 mb-8 text-center px-6"
      >
        Test your knowledge and challenge yourself in this exciting quiz game.
      </motion.p>

      {/* Animated Buttons Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex space-x-4"
      >
        <div className="flex justify-around gap-12">
        <button
          onClick={() => router.push("/auth/signup")}
          className="px-9 py-5 bg-blue-500  text-white hover:bg-blue-700 font-semibold rounded-lg transition transform hover:scale-110"
        >
          Sign Up
        </button>

        <button
          onClick={() => router.push("/auth/login")}
          className="px-9 py-5 bg-blue-500 text-white hover:bg-blue-700 font-semibold rounded-lg transition transform hover:scale-110"
        >
          Login
        </button>
        </div>
      </motion.div>
      

      {/* Play Now Button with Bounce Effect */}
      {/* <motion.button
        onClick={() => router.push("/dashboard")}
        initial={{ y: 10 }}
        animate={{ y: [10, -5, 10] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="mt-6 px-8 py-4 bg-white text-blue-400 text-lg font-bold rounded-lg hover:bg-blue-500 hover:text-white transition transform hover:scale-110"
      >
        Play Now
      </motion.button> */}
    </div>
  );
}
