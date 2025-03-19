"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-purple-600 to-blue-500 text-white p-6">
      {/* Header Section */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl md:text-6xl font-extrabold mb-6 text-center drop-shadow-lg"
      >
        Welcome to <span className="text-yellow-400">Jeopardy!</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="text-lg md:text-xl text-gray-300 mb-10 text-center px-6 max-w-2xl"
      >
        Test your knowledge and challenge yourself in this exciting quiz game. Play, learn, and compete!
      </motion.p>

      {/* Buttons Section */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <button
          onClick={() => router.push("/auth/signup")}
          className="px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-800 transition transform hover:scale-105"
        >
          Sign Up
        </button>

        <button
          onClick={() => router.push("/auth/login")}
          className="px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-800 transition transform hover:scale-105"
        >
          Login
        </button>
      </motion.div>

      {/* Blog and Contact Sections */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* Blog Section */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-400 mb-3">Latest from Our Blog</h2>
          <p className="text-gray-300 mb-4">Stay updated with the latest news, tips, and insights about the Jeopardy world. Explore interesting articles and sharpen your knowledge.</p>
          <Link href="/auth/blog">
            <button className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-full shadow-lg hover:from-green-600 hover:to-green-800 transition transform hover:scale-105">
              Read Blog
            </button>
          </Link>
        </div>

        {/* Contact Us Section */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-3">Get in Touch</h2>
          <p className="text-gray-300 mb-4">Have questions or need assistance? Contact our team for support and inquiries. We’d love to hear from you!</p>
          <Link href="/auth/contactForm">
            <button className="px-8 py-3 bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold rounded-full shadow-lg hover:from-red-600 hover:to-red-800 transition transform hover:scale-105">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
