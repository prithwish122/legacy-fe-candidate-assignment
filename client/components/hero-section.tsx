"use client"

import { ContainerScroll } from "@/components/ui/container-scroll-animation"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const router = useRouter()
  return (
    <div className="flex flex-col -mt-8">
      <ContainerScroll
        titleComponent={
          <>
            <div className="text-center px-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
                SIGN & VERIFY
              </h1>

              <p className="text-base md:text-lg text-white/70 mt-6">
                Sign and verify your custom messages
              </p>

              {/* CTA Button */}
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-8">
                <button className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors">
                  Try Demo 
                </button>
              </div>
            </div>
          </>
        }
      >
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-black">
          <div className="text-center text-white/50">
            <p>Your Product Preview</p>
          </div>
        </div>
      </ContainerScroll>
    </div>
  )
}
