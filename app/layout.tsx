import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import BottomNav from './components/BottomNav'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Summit App',
  description: 'The go-to platform for mountaineering',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-950 text-white`}>
        <main className="pb-20">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}