// Built by vsrupeshkumar
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/credit', label: '⚡ Dashboard', exact: true },
  { href: '/credit/stake', label: '🛡 Stake NCRD', exact: false },
  { href: '/credit/lend', label: '🧠 NeuroLend', exact: false },
  { href: '/credit/lending-demo', label: '📊 DeFi Demo', exact: false },
] as const

export default function CreditNav() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        display: 'flex',
        gap: 6,
        padding: '14px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexWrap: 'wrap',
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#8B5CF6',
          letterSpacing: '0.08em',
          display: 'flex',
          alignItems: 'center',
          marginRight: 8,
        }}
      >
        Credit PassportIT
      </span>
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              textDecoration: 'none',
              background: isActive ? 'rgba(139,92,246,0.15)' : 'transparent',
              border: `1px solid ${isActive ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
              color: isActive ? '#A78BFA' : 'rgba(255,255,255,0.55)',
              transition: 'all 0.2s',
            }}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
