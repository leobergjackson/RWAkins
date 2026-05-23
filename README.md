# Kubryx

One financial OS for Web3. Eight powerful tools — credit scoring, inheritance vaults, private trading, DeFi lending, treasury automation, AI agents, split payments, and a unified dashboard — across four chains.

**Live app: https://kubryx.vercel.app**

> This is a production deployment. Use the live app above — local setup is not supported and the infrastructure is private.

---

## Tools

| Tool | Route | Chain |
|------|-------|-------|
| Credit Passport | `/credit` | QIE Mainnet |
| Family Vault | `/legacy` | QIE Mainnet |
| Bill Split | `/split` | Stellar Testnet |
| Protocol Borrow Engine | `/lend` | Arbitrum |
| Agent Co-ordinator | `/agents` | Solana Devnet |
| Stealth Execution Suite | `/shadow` | Solana Devnet |
| Yield Operations Hub | `/treasury` | Solana Devnet |
| Private Vault | `/vault` | Multi-chain |

---

## Wallets

- **MetaMask** — QIE Mainnet, Arbitrum, Ethereum
- **Phantom** — Solana Devnet
- **Freighter** — Stellar Testnet

Every tool works in demo mode without a wallet connected.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind v4 |
| Backends | 7 services deployed on Render |
| Wallets | MetaMask, Phantom, Freighter |
| AI fallback | Groq llama-3.3-70b-versatile |
| Deployment | Vercel (frontend), Render (backends) |

---

## Not intended for local development

The backend services, API keys, database, RPC endpoints, and infrastructure are private and managed by the maintainer. There is no supported path to run this project locally.

If you want to explore the code, browse the source in this repository. If you want to use the product, go to https://kubryx.vercel.app.

---

## License & Attribution

This platform — including source code, architecture, infrastructure, backend systems, frontend, APIs, databases, UI/UX, and production workflows — was independently designed and built by **vsrupeshkumar**.

- **Founder & Developer:** vsrupeshkumar
- **License:** Apache License 2.0

All rights reserved.
