"use client";

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import SessionWrapper from '@/components/SessionWrapper';
import React from 'react'

export default function leaderboardLayout({children}) {
  return (
    <div>
      <SessionWrapper>
        <Navbar/>
        <main>
            {children}
        </main>
        <Footer>
            <Footer/>
        </Footer>
      </SessionWrapper>
    </div>
  )


}

 
