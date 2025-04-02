import SessionWrapper from '@/components/SessionWrapper'
import Sidebar from '@/components/Sidebar'
import React from 'react'

export default function pageListLayout({children}) {
  return (
    <div>
      <SessionWrapper>
      {/* <Sidebar/> */}

        <main>
            {children}
        </main>
      </SessionWrapper>
    </div>
  )
}
