"use client";
import React from 'react';
import { useRouter } from "next/navigation"; 
import Link from 'next/link';
import { signOut} from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Navbar() {
  const router = useRouter();
  
  const handleLogout = async () => {
    // Sign the user out using NextAuth
    await signOut({ callbackUrl: "/auth/login" });
    toast.success("User has logged out successfully");
    console.log("User has logged out successfully");
  };

  return (
    <div className="bg-purple-950 shadow-md shadow-white w-full fixed top-0 left-0">
      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="py-4">
        <ul className="flex items-center justify-between m-0">
          {/* Logo Section */}
          <li className="text-xl font-bold text-white cursor-pointer px-4">
            Logo
          </li>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 px-4 font-semibold">
            <li className="text-white hover:text-gray-500 cursor-pointer transition-colors">
              <Link href={'/auth/blog'}>Blog</Link>
            </li>
            <li className="text-white hover:text-gray-500 cursor-pointer transition-colors">
              <Link href={'/auth/leaderBoard'}>Leader Board</Link>
            </li>
            <li className="text-white hover:text-gray-500 cursor-pointer transition-colors">
              <Link href={'/auth/user'}>User Dashboard</Link>
            </li>
            <li className="text-white hover:text-gray-500 cursor-pointer transition-colors">
              <Link href={'/auth/contactForm'}>Contact Us</Link>
            </li>
            <li>
              <button 
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition-all cursor-pointer" 
                onClick={handleLogout}
              >
                Log out
              </button>
            </li>
          </div>

          {/* Mobile Hamburger Menu */}
          {/* <div className="md:hidden text-black cursor-pointer px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </div> */}
        </ul>
      </div>
    </div>
  );
}
