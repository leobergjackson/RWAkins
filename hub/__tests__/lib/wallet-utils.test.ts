import {
  truncateAddress,
  isMetaMaskInstalled,
  isPhantomInstalled,
  isFreighterInstalled,
  persistWallet,
  loadWallet,
  clearWallet,
} from '@/lib/wallet-utils'

describe('wallet-utils.ts', () => {
  describe('truncateAddress', () => {
    it('truncates EVM address correctly', () => {
      const addr = '0x1234567890abcdef1234567890abcdef12345678'
      expect(truncateAddress(addr)).toBe('0x1234...5678')
    })

    it('truncates Solana pubkey correctly', () => {
      const addr = '66DXeSqBccWxWWw9S21vxe2Mvvqqkmw5KsK5jqA42quz'
      const result = truncateAddress(addr, 4)
      expect(result).toContain('...')
      expect(result.length).toBeLessThan(addr.length)
    })

    it('returns original if too short', () => {
      expect(truncateAddress('0x123')).toBe('0x123')
    })

    it('respects custom chars param', () => {
      const addr = '0x1234567890abcdef1234567890abcdef12345678'
      const result = truncateAddress(addr, 6)
      expect(result).toBe('0x123456...345678')
    })
  })

  describe('sessionStorage wallet persistence', () => {
    const mockStorage: Record<string, string> = {}

    beforeEach(() => {
      // Clear mock storage
      Object.keys(mockStorage).forEach(k => delete mockStorage[k])
      Object.defineProperty(global, 'sessionStorage', {
        value: {
          getItem: (key: string) => mockStorage[key] ?? null,
          setItem: (key: string, val: string) => { mockStorage[key] = val },
          removeItem: (key: string) => { delete mockStorage[key] },
        },
        writable: true,
        configurable: true,
      })
      // Ensure window is defined
      if (typeof global.window === 'undefined') {
        Object.defineProperty(global, 'window', {
          value: global,
          writable: true,
          configurable: true,
        })
      }
    })

    it('persists and loads EVM wallet', () => {
      const address = '0xAe6A9CaF9739C661e593979386580d3d14abB502'
      persistWallet('evm', address)
      expect(loadWallet('evm')).toBe(address)
    })

    it('persists and loads Solana wallet', () => {
      const pubkey = '66DXeSqBccWxWWw9S21vxe2Mvvqqkmw5KsK5jqA42quz'
      persistWallet('solana', pubkey)
      expect(loadWallet('solana')).toBe(pubkey)
    })

    it('clears wallet correctly', () => {
      persistWallet('evm', '0x1234')
      clearWallet('evm')
      expect(loadWallet('evm')).toBe('')
    })

    it('returns empty string for missing wallet', () => {
      expect(loadWallet('stellar')).toBe('')
    })
  })

  describe('wallet detection', () => {
    it('returns false for MetaMask when window.ethereum missing', () => {
      expect(isMetaMaskInstalled()).toBe(false)
    })

    it('returns false for Phantom when window.solana missing', () => {
      expect(isPhantomInstalled()).toBe(false)
    })

    it('returns false for Freighter when window.freighter missing', () => {
      expect(isFreighterInstalled()).toBe(false)
    })
  })
})
