# Kubryx API Reference

## Hub (Next.js)

Base: `https://kubryx.vercel.app`

| Method | Path         | Description                                      |
|--------|--------------|--------------------------------------------------|
| GET    | `/api/health` | Returns `{ status, service, tools, chains, timestamp }` |

---

## CreditBlocks (Live)

Base: `https://creditblock-rs-backend.onrender.com`

| Method | Path                | Body / Params                          | Returns                                      |
|--------|---------------------|----------------------------------------|----------------------------------------------|
| POST   | `/api/score`        | `{ walletAddress: string }`            | `{ score, grade, history, factors, nftMinted }` |
| GET    | `/api/score/:address` | —                                    | same as above or 404                         |
| POST   | `/api/chat`         | `{ message: string, walletAddress: string }` | `{ reply: string }`                    |
| GET    | `/health`           | —                                      | `{ status: "ok" }`                           |

---

## EternalVault (Render)

Base: `https://kubryx-eternalvault.onrender.com`

| Method | Path                  | Body / Params                          | Returns                        |
|--------|-----------------------|----------------------------------------|--------------------------------|
| GET    | `/health`             | —                                      | `{ status: "ok", service: "eternalvault" }` |
| POST   | `/api/vaults/create`  | `{ owner, heir, file?, unlockDate? }`  | `{ vaultId, txHash }`          |
| GET    | `/api/vaults/:address`| —                                      | `Vault[]`                      |
| POST   | `/api/vaults/claim`   | `{ vaultId, heir }`                    | `{ success, txHash }`          |

---

## Lendora AI (Render)

Base: `https://kubryx-lendora.onrender.com`

| Method | Path                  | Body / Params                          | Returns                        |
|--------|-----------------------|----------------------------------------|--------------------------------|
| GET    | `/health`             | —                                      | `{ status: "ok", service: "lendora" }` |
| POST   | `/api/negotiate`      | `{ message, walletAddress, loanParams? }` | `{ reply, suggestedTerms? }` |
| GET    | `/api/loans/:address` | —                                      | `Loan[]`                       |
| POST   | `/api/loans/create`   | `{ borrower, amount, duration, terms }` | `{ loanId, txHash }`          |
| POST   | `/api/loans/repay`    | `{ loanId, amount }`                   | `{ success, remaining }`       |

---

## TrustMesh (Render)

Base: `https://kubryx-trustmesh.onrender.com`

| Method | Path                    | Body / Params                          | Returns                        |
|--------|-------------------------|----------------------------------------|--------------------------------|
| GET    | `/health`               | —                                      | `{ status: "ok", service: "trustmesh" }` |
| POST   | `/api/agents/deploy`    | `{ owner, name, role, permissions }`   | `{ agentId, signature }`       |
| GET    | `/api/agents/:pubkey`   | —                                      | `Agent[]`                      |
| POST   | `/api/agents/delegate`  | `{ agentId, task, signature }`         | `{ success }`                  |
| POST   | `/api/agents/revoke`    | `{ agentId }`                          | `{ success }`                  |
| GET    | `/api/activity/:pubkey` | —                                      | `ActivityItem[]`               |

---

## ShadowLedger (Render)

Base: `https://kubryx-shadow.onrender.com`

| Method | Path                    | Body / Params                          | Returns                        |
|--------|-------------------------|----------------------------------------|--------------------------------|
| GET    | `/health`               | —                                      | `{ status: "ok", service: "shadow" }` |
| POST   | `/api/org/setup`        | `{ name, admin }`                      | `{ orgId }`                    |
| GET    | `/api/org/:pubkey`      | —                                      | `Organization`                 |
| GET    | `/api/agents/status`    | —                                      | `AgentStatus[]` (7 items)      |
| POST   | `/api/agents/trigger`   | `{ agentType, action, params }`        | `{ result }`                   |
| GET    | `/api/activity`         | —                                      | `ActivityItem[]`               |

---

## PalmFlow (Vercel)

Base: `https://kubryx-palmflow.vercel.app`

| Method | Path                    | Body / Params                          | Returns                        |
|--------|-------------------------|----------------------------------------|--------------------------------|
| GET    | `/api/health`           | —                                      | `{ status: "ok", service: "palmflow" }` |
| GET    | `/api/treasury/:pubkey` | —                                      | `{ balance, inflow30d, outflow30d, yield }` |
| POST   | `/api/payroll/add`      | `{ recipient, ratePerSecond, token }`  | `{ streamId }`                 |
| GET    | `/api/payroll/:pubkey`  | —                                      | `PayrollStream[]`              |
| POST   | `/api/ai/advise`        | `{ message, treasuryData }`            | `{ advice }`                   |

---

## CipherVault (Render)

Base: `https://kubryx-cipher.onrender.com`

| Method | Path                    | Body / Params                          | Returns                        |
|--------|-------------------------|----------------------------------------|--------------------------------|
| GET    | `/health`               | —                                      | `{ status: "ok", service: "ciphervault" }` |
| POST   | `/api/trade/private`    | `{ asset, amount, fromChain, toChain }` | `{ tradeId, status }`         |
| GET    | `/api/trades/:pubkey`   | —                                      | `Trade[]`                      |
| GET    | `/api/privacy/score`    | —                                      | `{ score, breakdown }`         |

---

## On-Chain (No Backend)

### SyncSplit (Stellar)

- Contract: `CCEIBX7TF3OY5CWE5GDGZPFNNTIRTLLHDYJ4NQG4YLWYTNURUZ4YGKGF`
- RPC: `https://soroban-testnet.stellar.org`
- Horizon: `https://horizon-testnet.stellar.org`

### QIE Contracts

- RPC: `https://rpc.qie.digital` (Chain ID: `1990`)
- CreditPassportNFT: `0xAe6A9CaF9739C661e593979386580d3d14abB502`
- LendingVault: `0x36Fda9F9F17ea5c07C0CDE540B220fC0697bBcE3`
- NeuroCredStaking: `0x08DA91C81cebD27d181cA732615379f185FbFb51`
- NCRD Token: `0x7427734468598674645Aa71Ef651218A9Db2be11`

### TrustMesh (Solana)

- Program: `66DXeSqBccWxWWw9S21vxe2Mvvqqkmw5KsK5jqA42quz`
- RPC: `https://api.devnet.solana.com`
