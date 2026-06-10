// Built by vsrupeshkumar
// TabBar — 8 horizontal category tabs, CoverFi-style.
// Sits below TopBar; controls which items the sidebar shows.
'use client'

import { NAV_CATEGORIES } from '../lib/navCategories'

const BG = '#ffffff'
const BORDER = '#E2E8F0'
const MONO = 'var(--font-mono), "JetBrains Mono", "Fira Code", monospace'

interface Props {
  activeCategory: string
  onCategoryChange: (key: string) => void
  isMobile: boolean
}

export default function TabBar({ activeCategory, onCategoryChange, isMobile }: Props) {
  return (
    <div style={{
      height: isMobile ? 44 : 48,
      borderBottom: `1px solid ${BORDER}`,
      background: BG,
      display: 'flex',
      alignItems: 'stretch',
      overflowX: 'auto',
      overflowY: 'hidden',
      flexShrink: 0,
      position: 'sticky',
      top: 60,
      zIndex: 38,
      scrollbarWidth: 'none',
    }}>
      <style>{`
        .tabbar-scroll::-webkit-scrollbar { display: none; }
        .tab-btn { transition: color 0.15s, background 0.15s; }
        .tab-btn:hover { background: #F8FAFC !important; }
      `}</style>
      <div className="tabbar-scroll" style={{ display: 'flex', alignItems: 'stretch', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {NAV_CATEGORIES.map(cat => {
          const active = activeCategory === cat.key
          return (
            <button
              key={cat.key}
              className="tab-btn"
              onClick={() => onCategoryChange(cat.key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: isMobile ? 4 : 6,
                padding: isMobile ? '0 12px' : '0 18px',
                background: active ? `${cat.color}10` : 'transparent',
                border: 'none',
                borderBottom: active ? `2px solid ${cat.color}` : '2px solid transparent',
                color: active ? cat.color : '#64748B',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                fontSize: isMobile ? 11 : 12,
                fontWeight: active ? 700 : 500,
                letterSpacing: active ? '0.01em' : '0',
                height: '100%',
                outline: 'none',
              }}
            >
              <span style={{ fontSize: isMobile ? 13 : 14, lineHeight: 1 }}>{cat.icon}</span>
              <span style={{ fontFamily: isMobile ? 'inherit' : 'var(--font-jakarta, system-ui)' }}>
                {cat.label}
              </span>
              {/* Item count badge */}
              {!isMobile && (
                <span style={{
                  fontSize: 9, fontWeight: 700, lineHeight: 1,
                  color: active ? cat.color : '#94A3B8',
                  background: active ? `${cat.color}18` : '#F1F5F9',
                  border: `1px solid ${active ? cat.color + '30' : '#E2E8F0'}`,
                  borderRadius: 10, padding: '2px 5px',
                  fontFamily: MONO,
                  transition: 'all 0.15s',
                }}>
                  {cat.items.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Right fade gradient for overflow hint */}
      <div style={{
        position: 'sticky', right: 0, top: 0, bottom: 0, width: 32,
        flexShrink: 0,
        background: 'linear-gradient(to right, transparent, #ffffff)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
