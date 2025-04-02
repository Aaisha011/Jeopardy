"use client";

import React from 'react'
import Footer from '@/components/Footer';
import SessionWrapper from '@/components/SessionWrapper';
import Navbar from '@/components/Navbar';


export default function boardLayout({children}) {
  return (
    <div>
      <SessionWrapper>
        <Navbar/>
        <main className='flex-grow'>{children}</main>
        <footer>
        <Footer/>
        </footer>
      </SessionWrapper>
    </div>
  )
}



