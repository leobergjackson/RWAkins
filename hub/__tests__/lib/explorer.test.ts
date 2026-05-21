// Built by vsrupeshkumar
import { getExplorerUrl } from '@/lib/explorer'

describe('explorer.ts', () => {
  it('generates QIE tx URL', () => {
    const url = getExplorerUrl('qie', 'tx', '0xabc123')
    expect(url).toBe('https://mainnet.qie.digital/tx/0xabc123')
  })

  it('generates QIE address URL', () => {
    const url = getExplorerUrl('qie', 'address', '0xabc123')
    expect(url).toBe('https://mainnet.qie.digital/address/0xabc123')
  })

  it('generates Solana tx URL with devnet cluster', () => {
    const url = getExplorerUrl('solana', 'tx', 'sig123')
    expect(url).toContain('explorer.solana.com')
    expect(url).toContain('sig123')
    expect(url).toContain('devnet')
  })

  it('generates Stellar tx URL', () => {
    const url = getExplorerUrl('stellar', 'tx', 'txhash123')
    expect(url).toContain('stellar.expert')
    expect(url).toContain('testnet')
    expect(url).toContain('txhash123')
  })

  it('generates Arbitrum tx URL', () => {
    const url = getExplorerUrl('arbitrum', 'tx', '0xdef456')
    expect(url).toContain('arbiscan.io')
    expect(url).toContain('0xdef456')
  })
})
