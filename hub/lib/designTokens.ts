// Built by vsrupeshkumar
// Central design tokens — mirrors the landing/hero page (hub/app/page.tsx) +
// globals.css VERBATIM. Single source of truth so the dashboard/tool/hackathon
// pages share the hero's light "cloudy sky-blue/white" design language.
// Direction: LIGHT (confirmed). Do not invent values; every entry is copied
// from the hero. See DESIGN-TOKENS-AUDIT.md at repo root for provenance.

export const tokens = {
  color: {
    // backgrounds / surfaces
    bgCloud: 'var(--cloud-bg)',
    surface: '#ffffff',
    surfaceSubtle: '#F8FAFC',
    surfaceMutedGrad: 'linear-gradient(135deg,#F5F7FF 0%,#EEF2FF 100%)',
    surfaceCoolGrad: 'linear-gradient(180deg,#EEF2FF 0%,#E0F2FE 100%)',
    inverse: '#0A0F2E',

    // text
    textHeading: '#0A0F2E',
    textBody: '#475569',
    textMuted: '#64748B',
    textFaint: '#94A3B8',
    textOnAccent: '#ffffff',

    // accent (single brand family: blue → violet → pink)
    accent: '#3B5BFA',
    accentViolet: '#8B5CF6',
    accentPink: '#EC4899',

    // secondary / semantic
    success: '#10B981',
    forest: '#163b2c',
    pine: '#2f6b54',
    warning: '#f59e0b',
    danger: '#ef4444',

    // borders
    border: '#E2E8F0',
    borderSubtle: '#F1F5F9',
    borderStrong: '#E5E7EB',
    borderCool: '#E0E7FF',
    borderOnDark: 'rgba(255,255,255,0.1)',
  },

  gradient: {
    accent: 'linear-gradient(135deg,#3B5BFA 0%,#8B5CF6 50%,#EC4899 100%)',
    accentLine: 'linear-gradient(90deg,#3B5BFA,#8B5CF6,#EC4899)',
    button: 'linear-gradient(135deg,#8B5CF6 0%,#EC4899 100%)',
    gradientText: 'linear-gradient(135deg,#163b2c 0%,#2f6b54 50%,#3f9a73 100%)',
  },

  shadow: {
    resting: '0 2px 10px rgba(15,23,42,0.06)',
    card: '0 4px 12px rgba(0,0,0,0.05)',
    hover: '0 24px 60px -20px rgba(15,23,42,0.18)',
    elevated: '0 40px 100px -20px rgba(59,91,250,0.25)',
    modal: '0 20px 50px -10px rgba(15,23,42,0.25)',
    accentGlow: '0 10px 30px -10px rgba(139,92,246,0.55)',
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    huge: 32,
    pill: 999,
  },

  font: {
    body: 'var(--font-jakarta), "Plus Jakarta Sans", system-ui, sans-serif',
    heading: 'var(--font-jakarta), "Plus Jakarta Sans", system-ui, sans-serif',
    display: "'Syne', sans-serif",
    mono: 'var(--font-mono), "JetBrains Mono", "Fira Code", monospace',
    cursive: "'Dancing Script', cursive",
  },

  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
} as const

export type Tokens = typeof tokens
export default tokens
