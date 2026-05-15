import Navbar from './components/Navbar'
import Link from 'next/link'

const MODULES = [
  {
    icon: '◈', name: 'CreditBlocks', href: '/credit',
    tagline: 'AI Credit Passport',
    desc: 'On-chain credit scores as soulbound NFTs. Every DeFi protocol reads your score with one contract call.',
    chain: 'QIE', chainColor: '#F5C518',
    award: '🏆 $2,500 Winner',
  },
  {
    icon: '⬟', name: 'EternalVault', href: '/legacy',
    tagline: 'Digital Legacy Vault',
    desc: 'AES-GCM encrypted inheritance vault. Files locked on-chain. Heirs unlock after validator attestation.',
    chain: 'QIE', chainColor: '#F5C518',
    award: '🏆 $2,500 Winner',
  },
  {
    icon: '⬡', name: 'TrustMesh', href: '/agents',
    tagline: 'Multi-Agent AI Coordination',
    desc: 'Every AI agent gets a verified .sol identity. Ed25519 signed. One-click cascade revocation.',
    chain: 'Solana', chainColor: '#9945FF',
  },
  {
    icon: '🔐', name: 'CipherVault', href: '/vault',
    tagline: 'Private Cross-Chain Trading',
    desc: 'Institutions trade cross-chain assets in complete privacy. Zero metadata exposed.',
    chain: 'Multi', chainColor: '#06B6D4',
  },
  {
    icon: '◆', name: 'SyncSplit', href: '/split',
    tagline: 'On-Chain Bill Splitting',
    desc: 'Split bills using Soroban smart contracts on Stellar. Multi-wallet. Real-time settlement.',
    chain: 'Stellar', chainColor: '#3B82F6',
  },
  {
    icon: '◎', name: 'Lendora AI', href: '/lend',
    tagline: 'ZK-Powered DeFi Lending',
    desc: 'AI agents negotiate loan terms. Zero-knowledge credit scoring. Fast Ethereum L2 settlement.',
    chain: 'ETH L2', chainColor: '#6366F1',
    award: '🏆 $2,000 Winner',
  },
  {
    icon: '◇', name: 'PalmFlow AI', href: '/treasury',
    tagline: 'Autonomous Treasury OS',
    desc: 'AI agents stream payroll per-second, manage governance, and route yield autonomously on Solana.',
    chain: 'Solana', chainColor: '#10B981',
  },
  {
    icon: '▲', name: 'ShadowLedger', href: '/shadow',
    tagline: 'Invisible Financial OS',
    desc: '7 specialized AI agents run your entire organization invisibly on-chain. Private. Unstoppable.',
    chain: 'Solana', chainColor: '#C0C0C0',
  },
]

const STATS = [
  { value: '8',   label: 'Live Products' },
  { value: '4',   label: 'Blockchains'   },
  { value: '$7K', label: 'Prizes Won'    },
  { value: '0',   label: 'Mock Data'     },
]

export default function Home() {
  return (
    <>
      <Navbar />
      <main>

        {/* HERO */}
        <section style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '120px 24px 80px',
          position: 'relative', overflow: 'hidden',
          background: '#080808',
        }}>
          {/* Blob 1 */}
          <div style={{
            position: 'absolute', top: '-10%', right: '-5%',
            width: 600, height: 600, borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
            background: 'radial-gradient(circle, rgba(245,197,24,0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'blob1 14s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          {/* Blob 2 */}
          <div style={{
            position: 'absolute', bottom: '-10%', left: '-5%',
            width: 500, height: 500, borderRadius: '40% 60% 60% 40%/40% 40% 60% 60%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'blob2 18s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          {/* Grid */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 860 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 18px', borderRadius: 999,
              background: 'rgba(245,197,24,0.07)',
              border: '1px solid rgba(245,197,24,0.2)',
              marginBottom: 32,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#F5C518', letterSpacing: '0.08em', fontFamily: 'Satoshi, sans-serif' }}>
                8 LIVE PRODUCTS · 4 BLOCKCHAINS · 3 HACKATHON WINS
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(44px, 8vw, 96px)', fontWeight: 700, color: '#fff', marginBottom: 16 }}>
              The Multi-Chain<br />
              <span className="gold-text">AI Financial OS</span>
            </h1>

            <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.45)', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.75, fontFamily: 'Satoshi, sans-serif' }}>
              Credit scoring. Inheritance vaults. Private trading.
              Bill splitting. DeFi lending. Treasury automation.
              AI agents. All on-chain. All in one platform.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/credit" className="btn-gold">Launch App →</Link>
              <Link href="#modules" className="btn-outline">Explore Modules</Link>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div style={{
          background: '#050505',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '48px 24px',
        }}>
          <div style={{
            maxWidth: 900, margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24, textAlign: 'center',
          }}>
            {STATS.map((s, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: 'Clash Display, sans-serif',
                  fontSize: 'clamp(36px, 5vw, 52px)',
                  fontWeight: 700, lineHeight: 1,
                  background: 'linear-gradient(135deg, #FFD700, #C8860A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: 8,
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Satoshi, sans-serif' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODULES GRID */}
        <section id="modules" style={{ background: '#080808' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F5C518', marginBottom: 14, fontFamily: 'Satoshi, sans-serif' }}>
                — THE ECOSYSTEM —
              </p>
              <h2 style={{ fontSize: 'clamp(30px, 5vw, 52px)', color: '#fff', marginBottom: 14 }}>
                Eight Products. <span className="gold-text">One Platform.</span>
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', fontFamily: 'Satoshi, sans-serif' }}>
                Every product is live, deployed, and fully functional.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 16,
            }}>
              {MODULES.map(mod => (
                <Link key={mod.href} href={mod.href} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '28px 24px', height: '100%', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: 'rgba(245,197,24,0.07)',
                        border: '1px solid rgba(245,197,24,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, color: '#F5C518',
                      }}>
                        {mod.icon}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ADE80' }} />
                        <span style={{ fontSize: 10, color: '#4ADE80', fontWeight: 700, fontFamily: 'Satoshi, sans-serif' }}>LIVE</span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4, fontFamily: 'Clash Display, sans-serif' }}>
                      {mod.name}
                    </h3>
                    <p style={{ fontSize: 12, color: '#F5C518', fontWeight: 600, marginBottom: 10, fontFamily: 'Satoshi, sans-serif' }}>
                      {mod.tagline}
                    </p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 20, fontFamily: 'Satoshi, sans-serif' }}>
                      {mod.desc}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: 999, fontSize: 11,
                        fontWeight: 700, fontFamily: 'Satoshi, sans-serif',
                        background: `${mod.chainColor}18`,
                        border: `1px solid ${mod.chainColor}30`,
                        color: mod.chainColor,
                      }}>
                        {mod.chain}
                      </span>
                      {mod.award && (
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          color: '#F5C518', fontFamily: 'Satoshi, sans-serif',
                        }}>
                          {mod.award}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{
          background: '#000', borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '40px 24px', textAlign: 'center',
        }}>
          <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            Kubryx
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', fontFamily: 'Satoshi, sans-serif' }}>
            8 Products · 4 Chains · Built to win · MIT License
          </p>
        </footer>
      </main>
    </>
  )
}
