// Built by vsrupeshkumar
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FALLBACK_TOOLS, type ToolCard, type ToolStatus } from '@/lib/dashboard-fallbacks'

const BORDER = 'rgba(15,23,42,0.08)'
const MUTED  = 'rgba(15,23,42,0.62)'
const MUTED2 = 'rgba(15,23,42,0.4)'
const INK    = '#0A0F2E'
const MONO   = '"Fira Code","JetBrains Mono",monospace'

const STATUS_STYLE: Record<ToolStatus, { label: string; bg: string; fg: string; border: string }> = {
  live: { label: 'LIVE',        bg: 'rgba(16,185,129,0.12)', fg: '#10b981', border: 'rgba(16,185,129,0.4)' },
  beta: { label: 'BETA',        bg: 'rgba(245,158,11,0.12)', fg: '#f59e0b', border: 'rgba(245,158,11,0.4)' },
  soon: { label: 'COMING SOON', bg: 'rgba(15,23,42,0.06)',   fg: 'rgba(15,23,42,0.5)', border: 'rgba(15,23,42,0.15)' },
}

function Card({ tool }: { tool: ToolCard }) {
  const [hov, setHov] = useState(false)
  const disabled = tool.status === 'soon'
  const status = STATUS_STYLE[tool.status]

  const body = (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#FFFFFF',
        backgroundImage: hov && !disabled ? `linear-gradient(135deg, ${tool.color}10, rgba(255,255,255,0.96))` : 'none',
        border: `1px solid ${hov && !disabled ? tool.color + '55' : BORDER}`,
        borderRadius: 16,
        padding: 18,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'all 0.2s ease',
        transform: hov && !disabled ? 'translateY(-3px)' : 'translateY(0)',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: hov && !disabled ? `0 12px 32px ${tool.color}25, 0 4px 12px rgba(15,23,42,0.06)` : '0 4px 14px rgba(15,23,42,0.05)',
      }}
    >
      {/* Top row: icon + status */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: `linear-gradient(135deg, ${tool.color}, ${tool.color}cc)`,
          color: '#0A0F2E',
          display: 'grid', placeItems: 'center',
          fontSize: 17, fontWeight: 900,
          boxShadow: `0 6px 18px ${tool.color}40`,
        }}>
          {tool.name[0]}
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
          padding: '3px 7px', borderRadius: 4,
          background: status.bg, color: status.fg,
          border: `1px solid ${status.border}`,
          fontFamily: MONO,
        }}>
          {status.label}
        </span>
      </div>

      {/* Name + description */}
      <div>
        <div style={{ fontSize: 15, fontWeight: 800, color: INK, lineHeight: 1.2 }}>
          {tool.name}
        </div>
        <div style={{ fontSize: 12, color: MUTED, marginTop: 4, lineHeight: 1.4 }}>
          {tool.description}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
        {tool.stats.map(s => (
          <div key={s.label} style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: MUTED2, textTransform: 'uppercase' }}>
              {s.label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: INK, fontFamily: MONO, marginTop: 2 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Launch hint */}
      {!disabled && (
        <div style={{
          fontSize: 11, fontWeight: 600,
          color: hov ? tool.color : 'transparent',
          transition: 'color 0.18s',
          marginTop: -4,
        }}>
          Launch →
        </div>
      )}
    </div>
  )

  if (disabled) return <div>{body}</div>

  return (
    <Link href={tool.href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      {body}
    </Link>
  )
}

export default function ToolQuickAccess() {
  return (
    <div style={{ margin: '24px', marginTop: 0 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED2 }}>
            Operations Network
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: INK, marginTop: 2 }}>
            All 8 protocol tools
          </div>
        </div>
        <span style={{ fontSize: 11, color: MUTED2, fontFamily: MONO }}>8 tools · 1 coming</span>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
      }}>
        {FALLBACK_TOOLS.map(tool => <Card key={tool.name} tool={tool} />)}
      </div>
    </div>
  )
}
