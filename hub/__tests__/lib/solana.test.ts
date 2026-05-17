import { getSolanaBalance, getRecentTransactions } from '@/lib/solana'

global.fetch = jest.fn()

describe('solana.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getSolanaBalance', () => {
    it('returns SOL balance from lamports', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          jsonrpc: '2.0',
          id: 1,
          result: { value: 1500000000 },
        }),
      })
      const balance = await getSolanaBalance('66DXeSqBccWxWWw9S21vxe2Mvvqqkmw5KsK5jqA42quz')
      expect(balance).toBe(1.5)
    })

    it('returns 0 on RPC error', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
      const balance = await getSolanaBalance('invalid')
      expect(balance).toBe(0)
    })

    it('calls correct RPC endpoint', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ result: { value: 0 } }),
      })
      await getSolanaBalance('testpubkey')
      expect(fetch).toHaveBeenCalledWith(
        'https://api.devnet.solana.com',
        expect.objectContaining({ method: 'POST' })
      )
    })
  })

  describe('getRecentTransactions', () => {
    it('returns array of transaction signatures', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({
          result: [
            { signature: 'sig1', blockTime: 1700000000 },
            { signature: 'sig2', blockTime: 1700000001 },
          ],
        }),
      })
      const txs = await getRecentTransactions('testpubkey', 2)
      expect(Array.isArray(txs)).toBe(true)
      expect(txs).toHaveLength(2)
    })

    it('returns empty array on error', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('fail'))
      const txs = await getRecentTransactions('bad', 5)
      expect(txs).toEqual([])
    })
  })
})
