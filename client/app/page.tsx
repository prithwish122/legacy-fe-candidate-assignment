"use client"

import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import WhyChooseUs from "@/components/why-choose-us"
import HowItWorks from "@/components/how-it-works"

export default function Home() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/background.png')" }}>
      <Navbar />
      <HeroSection />
      <WhyChooseUs />
      <HowItWorks />
    </div>
  )
}
