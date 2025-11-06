import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import MessageSigner from '@/components/message-signer'

vi.mock('@dynamic-labs/sdk-react-core', () => {
  const primaryWallet = {
    address: '0x1111111111111111111111111111111111111111',
    getEthereumProvider: async () => ({
      request: vi.fn(async ({ method, params }) => {
        if (method === 'eth_accounts' || method === 'eth_requestAccounts') return ['0x1111111111111111111111111111111111111111']
        if (method === 'personal_sign') return '0xsignature'
        if (method === 'eth_sign') return '0xsignature'
        return null
      }),
    }),
    connector: {
      getWalletClient: async () => ({
        account: { address: '0x1111111111111111111111111111111111111111' },
        signMessage: async () => '0xsignature',
      }),
      signMessage: async () => '0xsignature',
    },
  }
  return {
    useDynamicContext: () => ({ primaryWallet, user: { id: 'user' } }),
  }
})

describe('MessageSigner', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ isValid: true, signer: '0x1111', originalMessage: 'hello' }),
    } as any)
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('validates input and signs + verifies a message', async () => {
    render(<MessageSigner />)
    const textarea = screen.getByPlaceholderText(/enter your message/i)
    const button = screen.getByRole('button', { name: /sign & verify/i })

    // disabled when empty
    expect(button).toBeDisabled()

    // type a message
    fireEvent.change(textarea, { target: { value: 'hello' } })
    expect(button).not.toBeDisabled()

    // sign & verify triggers fetch and updates localStorage
    fireEvent.click(button)

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))

    const raw = localStorage.getItem('messageSignerHistory')
    expect(raw).toBeTruthy()
    const items = JSON.parse(raw as string)
    expect(items.length).toBeGreaterThan(0)
    expect(items[0].message).toBe('hello')
    expect(items[0].signature).toBeTruthy()
  })
})


