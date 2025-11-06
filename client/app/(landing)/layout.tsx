import type { Metadata } from 'next'
import Navbar from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Home',
}

export default function LandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/background.png')" }}>
      <Navbar />
      {children}
    </div>
  )
}


