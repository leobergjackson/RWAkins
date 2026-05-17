// Solana RPC helpers — balance, account info, recent transactions

const SOLANA_RPC = 'https://api.devnet.solana.com'

export async function getSolanaBalance(pubkey: string): Promise<number> {
  try {
    const res = await fetch(SOLANA_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [pubkey],
      }),
    })
    const json = await res.json()
    const lamports: number = json?.result?.value ?? 0
    return lamports / 1_000_000_000
  } catch {
    return 0
  }
}

export interface AccountInfo {
  lamports: number
  owner: string
  executable: boolean
  rentEpoch: number
}

export async function getAccountInfo(pubkey: string): Promise<AccountInfo | null> {
  try {
    const res = await fetch(SOLANA_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getAccountInfo',
        params: [pubkey, { encoding: 'base58' }],
      }),
    })
    const json = await res.json()
    return json?.result?.value ?? null
  } catch {
    return null
  }
}

export interface SolanaTransaction {
  signature: string
  blockTime: number | null
  slot?: number
  err?: unknown
}

export async function getRecentTransactions(
  pubkey: string,
  limit = 10
): Promise<SolanaTransaction[]> {
  try {
    const res = await fetch(SOLANA_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [pubkey, { limit }],
      }),
    })
    const json = await res.json()
    return (json?.result ?? []) as SolanaTransaction[]
  } catch {
    return []
  }
}
