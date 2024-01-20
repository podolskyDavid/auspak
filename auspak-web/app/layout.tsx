import type { Metadata } from 'next'
import { GeistSans } from "geist/font/sans";
import './globals.css'

export const metadata: Metadata = {
  title: 'auspak app',
  description: 'auspak',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>{children}</body>
    </html>
  )
}
