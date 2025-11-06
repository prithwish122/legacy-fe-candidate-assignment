"use client"

import { useEffect, useState } from "react"

type HistoryItem = {
  id: string
  message: string
  signature: string
  isValid: boolean
  signer: string | null
  createdAt: number
}

const HISTORY_KEY = "messageSignerHistory"

export default function RecentSigners() {
  const [items, setItems] = useState<HistoryItem[]>([])

  const load = () => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY)
      if (!raw) {
        setItems([])
        return
      }
      const parsed: HistoryItem[] = JSON.parse(raw)
      setItems(Array.isArray(parsed) ? parsed.slice(0, 20) : [])
    } catch {
      setItems([])
    }
  }

  useEffect(() => {
    load()
    const onUpdate = () => load()
    window.addEventListener('messageSigner:updated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return () => {
      window.removeEventListener('messageSigner:updated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  }, [])

  if (items.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="text-white font-semibold mb-2">Recent signers</h3>
        <p className="text-gray-400 text-sm">No signatures yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
      <h3 className="text-white font-semibold mb-4">Recent signers</h3>
      <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
        {items.map((h) => (
          <div key={h.id} className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-xs text-gray-400 mb-1">{new Date(h.createdAt).toLocaleString()}</div>
            <div className="text-xs text-gray-300 break-words mb-1">signer: {h.signer || 'Unknown'}</div>
            <div className={`text-xs font-medium mb-2 ${h.isValid ? 'text-green-300' : 'text-red-300'}`}>{h.isValid ? 'Valid' : 'Invalid'}</div>
            <div className="text-xs text-gray-500 break-words">{h.message}</div>
          </div>
        ))}
      </div>
    </div>
  )
}


