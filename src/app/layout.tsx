/**
 * Global Layout
 * Root layout for the application
 */

import type { Metadata } from 'next'
import { LayoutWrapper } from '@/components/LayoutWrapper'
import './globals.css'

export const metadata: Metadata = {
  title: 'PrintFarm Pro - 3D Printing Automation',
  description: 'Modern automation platform for 3D printing businesses',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-slate-950 text-white antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
