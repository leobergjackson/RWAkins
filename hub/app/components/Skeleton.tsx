'use client'

import { useEffect } from 'react'

const skeletonStyle = `
@keyframes kbxPulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
.kbx-skeleton { animation: kbxPulse 1.5s ease-in-out infinite }
`

let injected = false
function useSkeletonStyle() {
  useEffect(() => {
    if (injected || typeof document === 'undefined') return
    const tag = document.createElement('style')
    tag.dataset.kbx = 'skeleton'
    tag.textContent = skeletonStyle
    document.head.appendChild(tag)
    injected = true
  }, [])
}

export function SkeletonCard() {
  useSkeletonStyle()
  return (
    <div className="card" style={{ opacity: 0.6 }}>
      <div className="kbx-skeleton" style={{ height: '1rem', width: '60%', background: 'rgba(255,255,255,0.08)', borderRadius: 4, marginBottom: '0.75rem' }} />
      <div className="kbx-skeleton" style={{ height: '2rem', width: '40%', background: 'rgba(245,197,24,0.15)', borderRadius: 4, marginBottom: '0.5rem' }} />
      <div className="kbx-skeleton" style={{ height: '0.75rem', width: '80%', background: 'rgba(255,255,255,0.05)', borderRadius: 4 }} />
    </div>
  )
}

export function SkeletonRow() {
  useSkeletonStyle()
  return (
    <div className="kbx-skeleton" style={{ height: '3rem', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: '0.5rem' }} />
  )
}
