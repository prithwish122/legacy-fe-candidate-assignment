"use client"

import { useState } from "react"

export default function MessageSigner() {
  const [message, setMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const simulateSign = (msg: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(`signed:${msg}`), 800)
    })
  }

  const handleSignMessage = async (): Promise<void> => {
    if (!message.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      const signature = await simulateSign(message)
      console.log("Message signed:", signature)
    } catch (err) {
      setError("Failed to sign message. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMessage(e.target.value)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Title Section */}
      <div className="text-center lg:text-left">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">ChainZap</h1>
        <p className="text-gray-300 text-lg">Sign a message to proceed as a developer</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-sm rounded-md p-3">
          {error}
        </div>
      )}

      {/* Message Box */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
        <textarea
          value={message}
          onChange={handleChange}
          placeholder="Enter your message here..."
          className="w-full h-32 bg-transparent text-white placeholder-gray-400 outline-none resize-none font-mono text-sm"
        />
      </div>

      {/* Sign Message Button */}
      <button
        onClick={handleSignMessage}
        disabled={isLoading || !message.trim()}
        className="w-full bg-black hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-lg"
      >
        {isLoading ? "Signing..." : "Sign Message"}
      </button>
    </div>
  )
}


