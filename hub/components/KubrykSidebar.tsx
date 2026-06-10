// Built by vsrupeshkumar
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { WalletPill } from './wallet/WalletPill'
import { useKubrykPlatform } from '../context/KubrykPlatformContext'
import { getCreditTier } from '../lib/platform/scoring'
import { NAV_CATEGORIES } from '../lib/navCategories'

const GOLD = '#3B5BFA'
const BG = '#ffffff'
const BORDER = '#E2E8F0'
const MONO = 'var(--font-mono), "JetBrains Mono", "Fira Code", monospace'

interface Props {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
  isMobile: boolean
  activeCategory?: string
}

export default function KubrykSidebar({ collapsed, onToggle, mobileOpen, onMobileClose, isMobile, activeCategory = 'overview' }: Props) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const platform = useKubrykPlatform()
  const tier = getCreditTier(platform.creditScore)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const w = isMobile ? 280 : collapsed ? 80 : 280
  const visible = isMobile ? mobileOpen : true
  const transform = isMobile
    ? (mobileOpen ? 'translateX(0)' : 'translateX(-100%)')
    : 'translateX(0)'

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 49 }}
        />
      )}

      <aside style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: w,
        background: BG,
        borderRight: `1px solid ${BORDER}`,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        transition: 'width 0.22s ease, transform 0.22s ease',
        transform,
        overflow: 'hidden',
      }}>

        {/* Logo */}
        <div style={{
          padding: collapsed && !isMobile ? '20px 0' : '20px',
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
          minHeight: 72,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: `linear-gradient(135deg, ${GOLD}, #8B5CF6)`,
            display: 'grid', placeItems: 'center',
            fontSize: 10, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em',
          }}>RWA</div>
          {(!collapsed || isMobile) && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0A0F2E', letterSpacing: '-0.02em', lineHeight: 1 }}>RWAkins</div>
              <div style={{ fontSize: 9, color: '#94A3B8', letterSpacing: '0.14em', marginTop: 2, fontFamily: MONO }}>FINANCIAL OS</div>
            </div>
          )}
        </div>

        {/* Dashboard link */}
        <div style={{ padding: collapsed && !isMobile ? '10px 8px' : '10px 12px', borderBottom: `1px solid ${BORDER}` }}>
          <Link href="/dashboard" style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed && !isMobile ? '8px' : '9px 12px',
            borderRadius: 10,
            background: pathname === '/dashboard' ? `${GOLD}18` : 'transparent',
            border: `1px solid ${pathname === '/dashboard' ? GOLD + '40' : 'transparent'}`,
            justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 18, color: pathname === '/dashboard' ? GOLD : '#64748B', flexShrink: 0 }}>⊞</span>
            {(!collapsed || isMobile) && (
              <span style={{ fontSize: 13, fontWeight: 600, color: pathname === '/dashboard' ? GOLD : '#475569' }}>
                Dashboard
              </span>
            )}
          </Link>
        </div>

        {/* Category Nav — filtered by active tab */}
        {(() => {
          const cat = NAV_CATEGORIES.find(c => c.key === activeCategory) ?? NAV_CATEGORIES[0]
          return (
            <nav style={{
              flex: 1,
              overflowY: 'auto',
              padding: collapsed && !isMobile ? '12px 8px' : '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}>
              {/* Category header */}
              {(!collapsed || isMobile) && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 8px', marginBottom: 6,
                }}>
                  <span style={{ fontSize: 13 }}>{cat.icon}</span>
                  <div style={{
                    fontSize: 9, fontWeight: 700,
                    color: cat.color,
                    letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: MONO,
                  }}>{cat.label}</div>
                </div>
              )}

              {/* Category items (with expandable sub-pages) */}
              {cat.items.map(item => {
                const active = isActive(item.href)
                const hasKids = !!item.children?.length
                const open = expanded[item.href] ?? active
                const showKids = hasKids && open && (!collapsed || isMobile)
                return (
                  <div key={item.href} style={{ display: 'flex', flexDirection: 'column' }}>
                    <Link href={item.href} style={{
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: collapsed && !isMobile ? '10px' : '9px 12px',
                      borderRadius: 10,
                      background: active ? `${item.color}18` : 'transparent',
                      border: `1px solid ${active ? item.color + '35' : 'transparent'}`,
                      justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                      transition: 'all 0.15s',
                      cursor: 'pointer',
                    }}
                      onMouseEnter={e => {
                        if (!active) (e.currentTarget as HTMLElement).style.background = '#F8FAFC'
                      }}
                      onMouseLeave={e => {
                        if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
                      }}
                    >
                      <span style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                        background: active ? `${item.color}25` : '#F1F5F9',
                        display: 'grid', placeItems: 'center',
                        fontSize: 14,
                        color: active ? item.color : '#64748B',
                        transition: 'all 0.15s',
                      }}>{item.icon}</span>
                      {(!collapsed || isMobile) && (
                        <>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: active ? item.color : '#334155', lineHeight: 1.2 }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.2, marginTop: 1 }}>
                              {item.desc}
                            </div>
                          </div>
                          {hasKids ? (
                            <span
                              onClick={e => { e.preventDefault(); e.stopPropagation(); setExpanded(s => ({ ...s, [item.href]: !open })) }}
                              title={open ? 'Collapse' : `Show ${item.children!.length} pages`}
                              style={{
                                width: 20, height: 20, flexShrink: 0,
                                display: 'grid', placeItems: 'center',
                                borderRadius: 6, fontSize: 9,
                                color: active ? item.color : '#64748B',
                                transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.18s ease',
                              }}
                            >▶</span>
                          ) : active ? (
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                          ) : null}
                        </>
                      )}
                    </Link>

                    {/* Nested sub-pages */}
                    {showKids && (
                      <div style={{
                        display: 'flex', flexDirection: 'column', gap: 1,
                        margin: '3px 0 5px 0', marginLeft: 27, paddingLeft: 12,
                        borderLeft: `1px solid ${item.color}33`,
                      }}>
                        {item.children!.map(sub => {
                          const subActive = pathname === sub.href || pathname.startsWith(sub.href + '/')
                          return (
                            <Link key={sub.href} href={sub.href} style={{
                              textDecoration: 'none',
                              display: 'flex', alignItems: 'center', gap: 8,
                              padding: '6px 10px', borderRadius: 7, fontSize: 12,
                              color: subActive ? item.color : '#64748B',
                              background: subActive ? `${item.color}14` : 'transparent',
                              fontWeight: subActive ? 600 : 500,
                              transition: 'all 0.15s',
                            }}
                              onMouseEnter={e => { if (!subActive) (e.currentTarget as HTMLElement).style.background = '#F8FAFC' }}
                              onMouseLeave={e => { if (!subActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                            >
                              <span style={{ width: 4, height: 4, borderRadius: '50%', flexShrink: 0, background: subActive ? item.color : '#CBD5E1' }} />
                              {sub.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}

          {/* Network status — fills dead space at bottom of nav */}
          {(!collapsed || isMobile) && (
            <div style={{ marginTop: 'auto', paddingTop: 16 }}>
              <div style={{
                fontSize: 9, fontWeight: 700, color: '#94A3B8',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                padding: '4px 8px', marginBottom: 4, fontFamily: MONO,
              }}>Networks</div>
              {[
                { name: 'Mantle Network', color: '#6366f1' },
                { name: 'Mantle Sepolia', color: '#10B981' },
                { name: 'Ethereum',       color: '#3B9BF5' },
                { name: 'Arbitrum',       color: '#12AAFF' },
              ].map(n => (
                <div key={n.name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '5px 8px', borderRadius: 6,
                }}>
                  <span style={{ fontSize: 11, color: '#64748B' }}>{n.name}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: n.color, fontFamily: MONO, fontWeight: 600 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: n.color, display: 'inline-block' }} />
                    Live
                  </span>
                </div>
              ))}
            </div>
          )}
          {(collapsed && !isMobile) && (
            <div style={{ marginTop: 'auto', paddingTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              {['#6366f1','#9945FF','#3B9BF5','#12AAFF'].map(c => (
                <span key={c} style={{ width: 6, height: 6, borderRadius: '50%', background: c, display: 'inline-block' }} />
              ))}
            </div>
          )}
            </nav>
          )
        })()}

        {/* Wallet — connect button or connected address pill */}
        {(!collapsed || isMobile) && <WalletPill />}

        {/* Quick stats */}
        {(!collapsed || isMobile) && (
          <div style={{
            margin: '0 12px 12px',
            padding: 12,
            borderRadius: 12,
            background: `${GOLD}10`,
            border: `1px solid ${GOLD}25`,
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8, fontFamily: MONO }}>
              Platform
            </div>
            {[
              { label: 'Score', value: String(platform.creditScore), color: tier.color },
              { label: 'Tier', value: tier.name, color: tier.color },
              { label: 'Vault', value: platform.vaultActive ? 'Active' : 'Inactive', color: platform.vaultActive ? '#10b981' : '#64748B' },
              { label: 'Chains', value: '4', color: '#0A0F2E' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#64748B' }}>{s.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: s.color, fontFamily: MONO }}>{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <div style={{ padding: '10px 12px', borderTop: `1px solid ${BORDER}` }}>
            <button onClick={onToggle} style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 10,
              padding: collapsed ? '9px' : '9px 12px',
              borderRadius: 10,
              border: `1px solid ${BORDER}`,
              background: 'transparent',
              color: '#64748B',
              cursor: 'pointer',
              fontSize: 12,
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 14, lineHeight: 1 }}>{collapsed ? '→' : '←'}</span>
              {!collapsed && <span>Collapse sidebar</span>}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
