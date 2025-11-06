import request from 'supertest'
import { ethers } from 'ethers'
import { app } from '../src/app'

describe('POST /api/verify-signature', () => {
  it('returns signer and isValid=true for a valid signature', async () => {
    const wallet = ethers.Wallet.createRandom()
    const message = 'hello from test suite'
    const signature = await wallet.signMessage(message)

    const res = await request(app)
      .post('/api/verify-signature')
      .send({ message, signature })
      .expect(200)

    expect(res.body).toMatchObject({
      isValid: true,
      signer: wallet.address,
      originalMessage: message,
    })
  })

  it('returns 400 for invalid signature format', async () => {
    const res = await request(app)
      .post('/api/verify-signature')
      .send({ message: 'msg', signature: '0xdeadbeef' })
      .expect(400)

    expect(res.body?.error).toBeTruthy()
  })

  it('returns 400 for bad payload', async () => {
    const res = await request(app)
      .post('/api/verify-signature')
      // Missing fields
      .send({})
      .expect(400)

    expect(res.body?.error).toContain('Invalid payload')
  })
})


