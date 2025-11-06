"use client"
import HeroSection from "@/components/hero-section"
import WhyChooseUs from "@/components/why-choose-us"
import HowItWorks from "@/components/how-it-works"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WhyChooseUs />
      <HowItWorks />
    </div>
  )
}


