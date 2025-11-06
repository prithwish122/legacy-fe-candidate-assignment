"use client"

import { useEffect, useMemo, useState } from "react"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"

type HistoryItem = {
  id: string
  message: string
  signature: string
  isValid: boolean
  signer: string | null
  createdAt: number
}

const HISTORY_KEY = "messageSignerHistory"

export default function MessageSigner() {
  const { primaryWallet, user } = useDynamicContext()
  const [message, setMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])

  // Load history from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY)
      if (raw) setHistory(JSON.parse(raw))
    } catch {}
  }, [])

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
      // notify other components (like RecentSigners)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('messageSigner:updated'))
      }
    } catch {}
  }, [history])

  const walletAddress = useMemo(() => primaryWallet?.address ?? null, [primaryWallet])

  const signWithWallet = async (msg: string): Promise<string> => {
    if (!primaryWallet) throw new Error("Connect a wallet to sign")
    if (!msg || typeof msg !== 'string') throw new Error("Message is empty")

    // Prefer EIP-1193 personal_sign for broader compatibility
    try {
      const provider = await primaryWallet.getEthereumProvider?.()
      if (provider) {
        let accounts = await provider.request({ method: "eth_accounts" })
        if (!accounts || accounts.length === 0) {
          accounts = await provider.request({ method: "eth_requestAccounts" })
        }
        const from = accounts?.[0]
        if (!from) throw new Error("No wallet account available")
        const hexMessage = `0x${new TextEncoder().encode(msg).reduce((acc, b) => acc + b.toString(16).padStart(2, '0'), '')}`
        let sig = await provider.request({ method: "personal_sign", params: [hexMessage, from] })
        if (!sig || typeof sig !== 'string') {
          // Fallback some providers accept message first param unhexed or eth_sign
          try {
            sig = await provider.request({ method: "personal_sign", params: [msg, from] })
          } catch {
            sig = await provider.request({ method: "eth_sign", params: [from, hexMessage] })
          }
        }
        if (!sig || typeof sig !== 'string') throw new Error("Signing failed: empty signature")
        return sig
      }
    } catch (e) {
      // fall through to connector-based signing
    }

    // Fallback to Dynamic connector paths (viem WalletClient first)
    const connector = primaryWallet.connector as any

    // Try viem WalletClient if available (best for embedded wallet)
    if (connector?.getWalletClient) {
      try {
        const client = await connector.getWalletClient()
        if (client?.signMessage) {
          const account = (client as any)?.account?.address || primaryWallet.address
          if (!account) throw new Error("No wallet account available")
          const sig = await client.signMessage({ account, message: msg })
          if (!sig || typeof sig !== 'string') throw new Error("Signing failed: empty signature")
          return sig
        }
      } catch (err: any) {
        // continue to connector.signMessage
      }
    }

    // Then try connector.signMessage API
    if (connector?.signMessage) {
      try {
        const account = primaryWallet.address
        if (!account) throw new Error("No wallet account available")
        const sig = await connector.signMessage({ message: msg, account })
        if (!sig || typeof sig !== 'string') throw new Error("Signing failed: empty signature")
        return sig
      } catch (err: any) {
        throw new Error(err?.details || err?.message || "Connector signing failed")
      }
    }

    throw new Error("Wallet provider unavailable for signing")
  }

  const getApiBaseUrl = (): string => {
    // If explicitly set, use it. Otherwise, use relative calls (/api/..) to hit next.config rewrites
    if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.length > 0) {
      return process.env.NEXT_PUBLIC_API_URL
    }
    return ''
  }

  const verifyWithBackend = async (msg: string, sig: string) => {
    const baseUrl = getApiBaseUrl()
    const res = await fetch(`${baseUrl}/api/verify-signature`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, signature: sig }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || "Verification request failed")
    }
    return await res.json()
  }

  const handleSignMessage = async (): Promise<void> => {
    if (!message.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      const signature = await signWithWallet(message)
      const result = await verifyWithBackend(message, signature)
      const item: HistoryItem = {
        id: `${Date.now()}`,
        message,
        signature,
        isValid: !!result?.isValid,
        signer: result?.signer ?? null,
        createdAt: Date.now(),
      }
      setHistory((prev) => [item, ...prev].slice(0, 20))
      setMessage("")
    } catch (err: any) {
      setError(err?.message || "Failed to sign or verify message.")
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
      <div className="text-center lg:text-left">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">Message Signer</h1>
        <p className="text-gray-300 text-lg">Sign a message and verify on backend</p>
      </div>

      {!walletAddress && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 text-sm rounded-md p-3">
          Connect a wallet to sign messages.
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-sm rounded-md p-3">
          {error}
        </div>
      )}

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
        <textarea
          value={message}
          onChange={handleChange}
          placeholder="Enter your message here..."
          className="w-full h-32 bg-transparent text-white placeholder-gray-400 outline-none resize-none font-mono text-sm"
        />
      </div>

      <button
        onClick={handleSignMessage}
        disabled={isLoading || !message.trim() || !primaryWallet}
        className="w-full bg-black hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-lg"
      >
        {isLoading ? "Signing..." : "Sign & Verify"}
      </button>

      {/* history moved to right column */}
    </div>
  )
}


