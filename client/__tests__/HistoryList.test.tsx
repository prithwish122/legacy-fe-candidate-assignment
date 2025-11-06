import { render, screen } from '@testing-library/react'
import React from 'react'
import HistoryList from '@/components/message-signer/history-list'

const HISTORY_KEY = 'messageSignerHistory'

describe('HistoryList', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders empty state when no history', () => {
    render(<HistoryList />)
    expect(screen.getByText(/no signatures yet/i)).toBeInTheDocument()
  })

  it('renders recent items from localStorage', () => {
    const items = [
      {
        id: '1',
        message: 'hello',
        signature: '0xsig',
        isValid: true,
        signer: '0xabc',
        createdAt: Date.now(),
      },
    ]
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items))
    render(<HistoryList />)
    expect(screen.getByText(/recent signatures/i)).toBeInTheDocument()
    expect(screen.getByText(/hello/)).toBeInTheDocument()
    expect(screen.getByText(/signer:/i)).toBeInTheDocument()
  })
})


