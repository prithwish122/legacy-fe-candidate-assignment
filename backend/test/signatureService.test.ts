import { verifySignature } from '../src/services/signatureService'
import { ethers } from 'ethers'

describe('signatureService.verifySignature', () => {
  it('verifies a normal ascii message', async () => {
    const wallet = ethers.Wallet.createRandom()
    const message = 'normal message'
    const signature = await wallet.signMessage(message)

    const res = await verifySignature(message, signature)
    expect(res.isValid).toBe(true)
    expect(res.signer).toBe(wallet.address)
    expect(res.originalMessage).toBe(message)
  })

  it('verifies an empty message', async () => {
    const wallet = ethers.Wallet.createRandom()
    const message = ''
    const signature = await wallet.signMessage(message)
    const res = await verifySignature(message, signature)
    expect(res.isValid).toBe(true)
    expect(res.signer).toBe(wallet.address)
  })

  it('verifies a long message', async () => {
    const wallet = ethers.Wallet.createRandom()
    const message = 'x'.repeat(4096)
    const signature = await wallet.signMessage(message)
    const res = await verifySignature(message, signature)
    expect(res.isValid).toBe(true)
    expect(res.signer).toBe(wallet.address)
  })

  it('verifies a unicode message', async () => {
    const wallet = ethers.Wallet.createRandom()
    const message = '🌈 unicode — äöü ß 中國 한국어'
    const signature = await wallet.signMessage(message)
    const res = await verifySignature(message, signature)
    expect(res.isValid).toBe(true)
    expect(res.signer).toBe(wallet.address)
  })

  it('throws for malformed signature', async () => {
    await expect(verifySignature('msg', '0x1234')).rejects.toThrow('Invalid signature format')
  })

  it('returns a different recovered signer for mismatched message/signature', async () => {
    const wallet = ethers.Wallet.createRandom()
    const signature = await wallet.signMessage('original')
    const res = await verifySignature('tampered', signature)
    expect(res.isValid).toBe(true)
    expect(res.signer).not.toBe(wallet.address)
  })
})


