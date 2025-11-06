"use client"

import { ContainerScroll } from "@/components/ui/container-scroll-animation"
import { useRouter } from "next/navigation"
import Image from "next/image"

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
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors cursor-pointer hover:cursor-pointer"
                >
                  Try Demo 
                </button>
              </div>
            </div>
          </>
        }
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative w-full max-w-5xl h-[28rem] md:h-[34rem] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="/image.png"
              alt="Hero preview"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </ContainerScroll>
    </div>
  )
}
