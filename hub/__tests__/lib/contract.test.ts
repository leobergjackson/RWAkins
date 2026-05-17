import { encodeAddress, decodeUint256, formatTokenAmount } from '@/lib/contract'

describe('contract.ts', () => {
  describe('encodeAddress', () => {
    it('pads address to 64 hex chars', () => {
      const address = '0xAe6A9CaF9739C661e593979386580d3d14abB502'
      const encoded = encodeAddress(address)
      expect(encoded).toHaveLength(64)
      expect(encoded).not.toContain('0x')
    })

    it('handles address without 0x prefix', () => {
      const address = 'Ae6A9CaF9739C661e593979386580d3d14abB502'
      const encoded = encodeAddress(address)
      expect(encoded).toHaveLength(64)
    })

    it('lowercases the address', () => {
      const address = '0xAE6A9CAF9739C661E593979386580D3D14ABB502'
      const encoded = encodeAddress(address)
      expect(encoded).toBe(encoded.toLowerCase())
    })
  })

  describe('decodeUint256', () => {
    it('decodes zero correctly', () => {
      expect(decodeUint256('0x' + '0'.repeat(64))).toBe(BigInt(0))
    })

    it('decodes 1000 tokens in 18 decimals', () => {
      const raw = BigInt('1000000000000000000000')
      const hex = '0x' + raw.toString(16).padStart(64, '0')
      expect(decodeUint256(hex)).toBe(raw)
    })

    it('handles hex without 0x prefix', () => {
      const hex = '0000000000000000000000000000000000000000000000000000000000000001'
      expect(decodeUint256(hex)).toBe(BigInt(1))
    })
  })

  describe('formatTokenAmount', () => {
    it('formats 1 token with 18 decimals', () => {
      const raw = BigInt('1000000000000000000')
      expect(formatTokenAmount(raw, 18)).toBe('1.00')
    })

    it('formats 1000 tokens with 18 decimals', () => {
      const raw = BigInt('1000000000000000000000')
      expect(formatTokenAmount(raw, 18)).toBe('1,000.00')
    })

    it('formats zero', () => {
      expect(formatTokenAmount(BigInt(0), 18)).toBe('0.00')
    })

    it('handles 6 decimal tokens (USDC style)', () => {
      const raw = BigInt('1000000')
      expect(formatTokenAmount(raw, 6)).toBe('1.00')
    })
  })
})
