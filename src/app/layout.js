"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SessionProvider } from "next-auth/react";
// import AuthProvider from "@/component/authProvider/AuthProvider";
import SessionWrapper from "@/components/SessionWrapper";

import { CartProvider } from "@/context/cartContext";
import { ToastContainer } from "react-toastify";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   // subsets: ["latin"],
// });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <SessionWrapper>
        <CartProvider>
          {/* <Navbar/> */}
        <Provider store={store}>
          {children}
        </Provider>
        </CartProvider>
        </SessionWrapper>


      </body>
    </html>
  );
}
