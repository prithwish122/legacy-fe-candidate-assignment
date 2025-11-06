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

export default function HistoryList() {
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
      <div>
        <p className="text-gray-400 text-sm">No signatures yet.</p>
      </div>
    )
  }

  return (
    <div className="mt-2">
      <div className="space-y-3">
        {items.map((h) => (
          <div key={h.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="text-sm text-gray-400 mb-1">{new Date(h.createdAt).toLocaleString()}</div>
            <div className="text-base text-gray-200 break-words mb-2">{h.message}</div>
            <div className="text-sm text-gray-400 break-words mb-1">sig: {h.signature.slice(0, 20)}…{h.signature.slice(-12)}</div>
            <div className="text-sm text-gray-400 break-words mb-1">signer: {h.signer || "Unknown"}</div>
            <div className={`text-sm font-medium ${h.isValid ? 'text-green-300' : 'text-red-300'}`}>
              {h.isValid ? 'Valid' : 'Invalid'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


