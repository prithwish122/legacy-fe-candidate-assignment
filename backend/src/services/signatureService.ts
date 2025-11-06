import { ethers } from 'ethers'

export type VerifyResult = {
  isValid: boolean
  signer: string | null
  originalMessage: string
}

export async function verifySignature(message: string, signature: string): Promise<VerifyResult> {
  let recoveredAddress: string | null = null
  try {
    recoveredAddress = ethers.verifyMessage(message, signature)
  } catch (e) {
    throw new Error('Invalid signature format')
  }

  const isValid = !!recoveredAddress && /^0x[a-fA-F0-9]{40}$/.test(recoveredAddress)

  return {
    isValid,
    signer: recoveredAddress ?? null,
    originalMessage: message,
  }
}


