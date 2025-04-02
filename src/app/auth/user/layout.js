// src/app/auth/user/layout.js (if nested)
"use client";

import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SessionWrapper";

export default function UserDashboardLayout({ children }) {
  return (
    <SessionWrapper>
      <Navbar />
      <main className="flex-grow">{children}</main>
      {/* <Footer /> */}
    </SessionWrapper>
  );
}