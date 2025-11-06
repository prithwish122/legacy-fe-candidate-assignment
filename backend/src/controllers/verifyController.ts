import { Request, Response } from 'express'
import { verifySignature } from '../services/signatureService'

type VerifyBody = {
  message?: unknown
  signature?: unknown
}

export async function verifySignatureController(req: Request<unknown, unknown, VerifyBody>, res: Response) {
  const { message, signature } = req.body || {}

  if (typeof message !== 'string' || typeof signature !== 'string') {
    return res.status(400).json({ error: 'Invalid payload. Expect { message: string, signature: string }' })
  }

  try {
    const result = await verifySignature(message, signature)
    return res.json(result)
  } catch (error: any) {
    return res.status(400).json({ error: error?.message || 'Verification failed' })
  }
}


