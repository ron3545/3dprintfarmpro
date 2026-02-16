'use client'

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

interface LayoutWrapperProps {
  children: ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <>
      <Sidebar />
      <main className="md:ml-64 min-h-screen">
        {children}
      </main>
    </>
  )
}
