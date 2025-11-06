import request from 'supertest'
import { ethers } from 'ethers'
import { app } from '../src/app'

describe('Verify controller - POST /api/verify-signature', () => {
  it('returns 200 with correct signer for a valid signature', async () => {
    const wallet = ethers.Wallet.createRandom()
    const message = 'hello from controller test'
    const signature = await wallet.signMessage(message)

    const res = await request(app)
      .post('/api/verify-signature')
      .send({ message, signature })
      .expect(200)

    expect(res.body).toEqual({
      isValid: true,
      signer: wallet.address,
      originalMessage: message,
    })
  })

  it('supports empty string message', async () => {
    const wallet = ethers.Wallet.createRandom()
    const message = ''
    const signature = await wallet.signMessage(message)

    const res = await request(app)
      .post('/api/verify-signature')
      .send({ message, signature })
      .expect(200)

    expect(res.body.isValid).toBe(true)
    expect(res.body.signer).toBe(wallet.address)
    expect(res.body.originalMessage).toBe('')
  })

  it('supports unicode/emoji messages', async () => {
    const wallet = ethers.Wallet.createRandom()
    const message = '🚀✨ こんにちは مرحبا – unicode test'
    const signature = await wallet.signMessage(message)

    const res = await request(app)
      .post('/api/verify-signature')
      .send({ message, signature })
      .expect(200)

    expect(res.body.isValid).toBe(true)
    expect(res.body.signer).toBe(wallet.address)
    expect(res.body.originalMessage).toBe(message)
  })

  it('returns 200 for mismatched message/signature and exposes recovered signer (not original)', async () => {
    const wallet = ethers.Wallet.createRandom()
    const message = 'original message'
    const signature = await wallet.signMessage(message)

    // Tamper the message
    const res = await request(app)
      .post('/api/verify-signature')
      .send({ message: message + ' (tampered)', signature })
      .expect(200)

    // The recovered signer will not equal the wallet that signed the original message
    expect(res.body.isValid).toBe(true)
    expect(res.body.signer).not.toBe(wallet.address)
  })

  it('returns 400 on invalid signature format', async () => {
    const res = await request(app)
      .post('/api/verify-signature')
      .send({ message: 'msg', signature: '0xdeadbeef' })
      .expect(400)
    expect(res.body.error).toBeTruthy()
  })

  it('returns 400 on missing fields', async () => {
    const res = await request(app)
      .post('/api/verify-signature')
      .send({})
      .expect(400)
    expect(res.body.error).toContain('Invalid payload')
  })

  it('returns 400 on wrong types', async () => {
    const res = await request(app)
      .post('/api/verify-signature')
      .send({ message: 123, signature: true })
      .expect(400)
    expect(res.body.error).toContain('Invalid payload')
  })
})


