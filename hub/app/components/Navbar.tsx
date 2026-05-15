'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const MODULES = [
  { label: 'Credit',   href: '/credit'   },
  { label: 'Legacy',   href: '/legacy'   },
  { label: 'Agents',   href: '/agents'   },
  { label: 'Vault',    href: '/vault'    },
  { label: 'Split',    href: '/split'    },
  { label: 'Lend',     href: '/lend'     },
  { label: 'Treasury', href: '/treasury' },
  { label: 'Shadow',   href: '/shadow'   },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 64,
      background: scrolled ? 'rgba(8,8,8,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(245,197,24,0.1)' : '1px solid transparent',
      transition: 'all 0.3s ease',
      display: 'flex', alignItems: 'center',
      padding: '0 32px',
      justifyContent: 'space-between',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: 'linear-gradient(135deg, #FFD700, #C8860A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Clash Display, sans-serif', fontWeight: 700,
          fontSize: 14, color: '#000',
        }}>K</div>
        <span style={{
          fontFamily: 'Clash Display, sans-serif', fontWeight: 600,
          fontSize: 18, color: '#fff',
        }}>Kubryx</span>
      </Link>

      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {MODULES.map(m => (
          <Link key={m.href} href={m.href} style={{
            padding: '6px 12px', borderRadius: 8,
            fontSize: 13, fontWeight: 500,
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            transition: 'color 0.2s',
            fontFamily: 'Satoshi, sans-serif',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#F5C518')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          >
            {m.label}
          </Link>
        ))}
        <Link href="/credit" className="btn-gold" style={{ marginLeft: 12, padding: '8px 20px', fontSize: 13 }}>
          Launch App
        </Link>
      </div>
    </nav>
  )
}
