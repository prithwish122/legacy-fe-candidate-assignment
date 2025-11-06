"use client"

import { Github, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full -mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Decentralised Masters</h3>
              <p className="text-gray-400 mt-2 text-sm md:text-base">Secure auth, message signing, and verification—designed to scale.</p>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="mailto:hello@example.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
              >
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-white/50 text-xs">© {new Date().getFullYear()} Decentralised Masters. All rights reserved.</p>
            <div className="flex items-center gap-6 text-xs text-white/60">
              <a href="#" className="hover:text-white/90 transition">Privacy</a>
              <a href="#" className="hover:text-white/90 transition">Terms</a>
              <a href="#" className="hover:text-white/90 transition">Status</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


