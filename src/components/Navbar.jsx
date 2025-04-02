"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"; 
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cartContext';

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const { cartCount } = useCart(); // Get cartCount from context

  useEffect(() => {
    if (status === "loading") return; // Wait for session to be ready

    if (!session || !session.user?.id) {
      router.push("/auth/login");
      return;
    }

    fetchUserData();
    fetchUserScore();
  }, [session, status, router]);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/userData`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } 
  };

  // Fetch user scores
  const fetchUserScore = async () => {
    try {
      const response = await axios.get(`/api/scores?userId=${session?.user?.id}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });

      if (response.data.success) {
        setTotalScore(response.data.user.totalScore || 0);
      } else {
        console.error("Error fetching scores:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user scores:", error);
    }
  };

  const handleLogout = async () => {
    // Sign the user out using NextAuth
    await signOut({ callbackUrl: "/auth/login" });
    toast.success("User has logged out successfully");
    console.log("User has logged out successfully");
  };

  return (
    <div className="bg-purple-950 shadow-md shadow-white w-full top-0 left-0">
      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="py-4">
        <ul className="flex items-center justify-between m-0">
          {/* Logo Section */}
          <li className="text-xl font-bold text-white cursor-pointer px-4">
            <Image 
              src='/jeopardy logo.jpeg' 
              alt='logo' 
              height={11} 
              width={80} 
              className='border-amber-50 border-2 rounded-sm' 
            />
          </li>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2 px-4 font-semibold">
            <div className="flex items-center space-x-3">
              <li className="text-white hover:text-gray-500 cursor-pointer transition-colors">
                <Link href={'/auth/board'}>Quiz board</Link>
              </li>
              <li className="text-white hover:text-gray-500 cursor-pointer transition-colors">
                <Link href={'/auth/blog'}>Blog</Link>
              </li>
              <li className="text-white hover:text-gray-500 cursor-pointer transition-colors">
                <Link href={'/auth/store'}>Store</Link>
              </li>
              <li className="text-white hover:text-gray-500 cursor-pointer transition-colors">
                <Link href={'/auth/leaderBoard'}>Leaderboard</Link>
              </li>
              <li className="text-white hover:text-gray-500 cursor-pointer transition-colors">
                <Link href={'/auth/user'}>User Dashboard</Link>
              </li>
              <li className="text-white hover:text-gray-500 cursor-pointer transition-colors">
                <Link href={'/auth/contactForm'}>Contact Us</Link>
              </li>
            </div>

            {/* User Welcome Message */}
            <li className="text-purple-400 hover:text-gray-500 cursor-pointer transition-colors mx-4">
              <h5 className="text-xl font-bold text-center">
                Welcome, {user?.name || session?.user?.name}!
              </h5>
            </li>

            {/* Cart Icon */}
            <li className="relative">
              <Link href="/auth/store/cart"> {/* Optional: Link to a cart page */}
                <ShoppingCart className="w-6 h-6 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>

            {/* Logout Button */}
            <li>
              <button 
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition-all cursor-pointer" 
                onClick={handleLogout}
              >
                Log out
              </button>
            </li>
          </div>

          {/* Mobile Hamburger Menu (Uncomment and style as needed) */}
          {/* <div className="md:hidden text-white cursor-pointer px-4">
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