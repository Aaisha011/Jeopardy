"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Footer() {
  const { data: session } = useSession();

  return (
    <footer className="bg-purple-950 text-white py-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section: Branding & Copyright */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-xl font-extrabold tracking-tight">
            Jeopardy Quiz Game
          </h3>
          {/* <p className="text-gray-400 text-sm mt-2">
            © {new Date().getFullYear()} Jeopardy Quiz. All Rights Reserved.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Powered by xAI Technology
          </p> */}
        </div>

        {/* Middle Section: Navigation Links */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-md font-semibold text-gray-200 mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/auth/board"
                className="text-gray-300 hover:text-white hover:underline transition duration-200"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/auth/store"
                className="text-gray-300 hover:text-white hover:underline transition duration-200"
              >
                Store
              </Link>
            </li>
            <li>
              <Link
                href="/auth/user"
                className="text-gray-300 hover:text-white hover:underline transition duration-200"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                href="/auth/leaderboard"
                className="text-gray-300 hover:text-white hover:underline transition duration-200"
              >
                Leaderboard
              </Link>
            </li>
          </ul>
        </div>
       

        {/* Right Section: User Info & Call-to-Action */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <p className="text-sm text-gray-300 mb-3">
            {session ? (
              <>
                Welcome back, <span className="font-semibold">{session.user.name}</span>!
              </>
            ) : (
              "Join the ultimate quiz challenge today!"
            )}
          </p>
          <Link
            href={session ? "/auth/board" : "/api/auth/signin"}
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-md transition duration-200"
          >
            {session ? "Play Now" : "Sign In"}
          </Link>
        </div>
      </div>

      {/* Bottom Bar: Additional Links */}
      <div className="mt-6 border-t border-gray-700 pt-4">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <div className="mb-2 md:mb-0">
            <Link href="/privacy" className="hover:text-white mx-2 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white mx-2 transition">
              Terms of Service
            </Link>
            <Link href="/auth/contactForm" className="hover:text-white mx-2 transition">
              Contact Us
            </Link>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            © {new Date().getFullYear()} Jeopardy Quiz. All Rights Reserved.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Powered by xAI Technology
          </p>
          <p>
            Designed with <span className="text-red-400">♥</span> for quiz enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}