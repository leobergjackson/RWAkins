# DESIGN-TOKENS-AUDIT.md

**Source of truth:** the live landing/hero page `hub/app/page.tsx` + `hub/app/globals.css` + `hub/app/layout.tsx` (all READ-ONLY).
**Direction (confirmed by user):** *Light cloudy* — propagate the landing page's light sky-blue/white design language to every dashboard / hackathon / tool page and the chrome (sidebar, topbar, tabbar). Fold all stray teal/purple/gold dark-theme accents into this system.

Every value below is copied **verbatim** from the source files. The right-hand column cites where it was extracted.

---

## 1. Backgrounds / Surfaces

| Token | Value | Source |
|---|---|---|
| `bgCloud` (page) | `var(--cloud-bg)` → `radial-gradient(...) ... linear-gradient(180deg,#eef4fa 0%,#f6fafd 45%,#ffffff 100%)` | globals.css `:root --cloud-bg`; page.tsx `Home` root `background:'var(--cloud-bg)'` |
| `bgHero` | `.hero-bg` (cloud gradient + light rays) | globals.css `.hero-bg`; page.tsx `<section className="hero-bg">` |
| `surface` (card) | `#ffffff` | page.tsx cards (`HowItWorks`, `Ecosystem`, `InvoiceCard`) |
| `surfaceSubtle` | `#F8FAFC` | derived from slate-50 usage; `#F1F5F9` borders |
| `surfaceMutedGrad` | `linear-gradient(135deg,#F5F7FF 0%,#EEF2FF 100%)` | page.tsx `StatsBar` |
| `surfaceCoolGrad` | `linear-gradient(180deg,#EEF2FF 0%,#E0F2FE 100%)` | page.tsx `DashboardPreview` |
| `footerBg` (inverse) | `#0A0F2E` | page.tsx `Footer` |

## 2. Text

| Token | Value | Source |
|---|---|---|
| `textHeading` | `#0A0F2E` (navy) | page.tsx h1/h2/h3; globals `--foreground` |
| `textBody` | `#475569` (slate-600) | page.tsx hero `<p>`, FinalCTA |
| `textMuted` | `#64748B` (slate-500) | page.tsx section subtitles |
| `textFaint` | `#94A3B8` (slate-400) | page.tsx InvoiceCard labels, TrustBar |
| `textOnAccent` | `#ffffff` | page.tsx `.btn-gradient`, FinalCTA |

## 3. Accent (single brand family: blue → violet → pink)

| Token | Value | Source |
|---|---|---|
| `accent` (primary) | `#3B5BFA` | globals `--blue`; page.tsx Eyebrow, links, `#3B5BFA` accents |
| `accentViolet` | `#8B5CF6` | globals `--violet`; gradient mid-stop |
| `accentPink` | `#EC4899` | globals `--pink`; gradient end-stop |
| `accentGradient` | `linear-gradient(135deg,#3B5BFA 0%,#8B5CF6 50%,#EC4899 100%)` | page.tsx `FinalCTA`, `.btn-gradient` (violet→pink) |
| `accentLine` | `linear-gradient(90deg,#3B5BFA,#8B5CF6,#EC4899)` | page.tsx `Eyebrow` rule |
| `gradientTextBg` | `linear-gradient(135deg,#163b2c 0%,#2f6b54 50%,#3f9a73 100%)` | globals `.gradient-text` (forest green) |

## 4. Secondary / semantic (kept as semantic, NOT a second brand)

| Token | Value | Source |
|---|---|---|
| `success` | `#10B981` (emerald) | page.tsx `HowItWorks` step 3, pills; globals `.badge-live` |
| `forest` | `#163b2c` | globals `--green`; page.tsx HackathonBanner |
| `pine` | `#2f6b54` | globals `--green-2` |
| `warning` | `#f59e0b` | globals `.badge-demo` |
| `danger` | `#ef4444` | semantic (risk) — retained for risk/error states only |

## 5. Borders

| Token | Value | Source |
|---|---|---|
| `border` (default card) | `#E2E8F0` | page.tsx `module-card`, Ecosystem cards |
| `borderSubtle` | `#F1F5F9` | page.tsx InvoiceCard divider, TrustBar |
| `borderStrong` | `#E5E7EB` | globals `.btn-ghost` |
| `borderCool` | `#E0E7FF` | page.tsx StatsBar |
| `borderOnDark` | `rgba(255,255,255,0.1)` | page.tsx Footer dividers |

## 6. Shadow ladder

| Token | Value | Source |
|---|---|---|
| `shadowResting` | `0 2px 10px rgba(15,23,42,0.06)` | page.tsx hero pills |
| `shadowCard` | `0 4px 12px rgba(0,0,0,0.05)` | globals `.badge-*` |
| `shadowHover` | `0 24px 60px -20px rgba(15,23,42,0.18)` | globals `.module-card:hover` |
| `shadowElevated` | `0 40px 100px -20px rgba(59,91,250,0.25)` | page.tsx InvoiceCard |
| `shadowModal` | `0 20px 50px -10px rgba(15,23,42,0.25)` | page.tsx CookieBanner |
| `shadowAccentGlow` | `0 10px 30px -10px rgba(139,92,246,0.55)` | globals `.btn-gradient` |

## 7. Radius

| Token | Value | Source |
|---|---|---|
| `sm` | `8` | page.tsx nav items, small chips |
| `md` | `12` | page.tsx stat tiles |
| `lg` | `16` | page.tsx icon tiles |
| `xl` | `20` | page.tsx Ecosystem cards |
| `xxl` | `24` | page.tsx HowItWorks cards, InvoiceCard |
| `huge` | `32` | page.tsx FinalCTA panel |
| `pill` | `999` | page.tsx buttons/badges |

## 8. Typography

| Token | Value | Source |
|---|---|---|
| `fontBody` / `fontHeading` | `var(--font-jakarta), "Plus Jakarta Sans", system-ui, sans-serif` | layout.tsx `Plus_Jakarta_Sans`; body style |
| `fontDisplay` (CSS titles) | `'Syne', sans-serif` | globals `.page-title` |
| `fontMono` | `var(--font-mono), "JetBrains Mono", "Fira Code", monospace` | layout.tsx `JetBrains_Mono`; page.tsx DashFrame |
| `fontCursive` (eyebrow) | `'Dancing Script', cursive` | globals `.page-eyebrow`; page.tsx HackathonBanner |
| weights | 400 / 500 / 600 / 700 / 800 / 900 | page.tsx throughout |
| heading tracking | `-0.02em` → `-0.04em` | page.tsx h1/h2/stat numbers |
| eyebrow tracking | `0.16em`–`0.18em` uppercase | page.tsx Eyebrow / section labels |

---

## Dark→Light mapping rules (how stray dark/teal/purple/gold values get folded)

| Old (dark theme) | → New (hero light) |
|---|---|
| Page bg `#080808` / `#080810` / `#0A0A0F` | `var(--cloud-bg)` (or `#ffffff` for inner sections) |
| Card surface `rgba(255,255,255,0.03–0.06)` | `#ffffff` |
| Border `rgba(255,255,255,0.06–0.12)` | `#E2E8F0` (subtle: `#F1F5F9`) |
| Text `#fff` / `rgba(255,255,255,0.9)` | `#0A0F2E` |
| Text `rgba(255,255,255,0.6/0.45/0.3)` | `#475569` / `#64748B` / `#94A3B8` |
| Gold `#F5C518` (brand accent) | `#3B5BFA` (primary accent) |
| Teal `#2dd4bf` / `#14b8a6` | `#10B981` (semantic success) or `#3B5BFA` (accent) |
| Purple `#8b5cf6` (as brand) | kept only inside `accentGradient`; standalone → `#3B5BFA` |
| Dark glow shadows `0 0 Npx rgba(accent,...)` | hero shadow ladder (`shadowResting`/`shadowHover`) |
| Mono `'Fira Code'` literal | `fontMono` token (JetBrains Mono first) |

> **Semantic colors retained:** green = healthy/ok, red = risk/error, amber = warning/demo. These exist in the hero palette (`#10B981`, `#f59e0b`) and convey state, not brand — so they stay, just normalized to the hero values.
