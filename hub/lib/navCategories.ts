// Built by vsrupeshkumar
// 8-category navigation structure — maps to all RWAkins routes.
// Drives the TabBar (category selection) + KubrykSidebar (filtered items).

export interface NavSubItem {
  label: string
  href: string
}

export interface NavItem {
  label: string
  href: string
  icon: string
  desc: string
  color: string
  children?: NavSubItem[]
}

// ── Sub-page maps (mirror each feature's own in-dashboard nav) ───────────────
// These surface every previously-built sub-page directly in the sidebar so
// nothing is hidden behind a dashboard's internal tab bar.
const TREASURY_SUB: NavSubItem[] = [
  { label: 'RWA Vault',     href: '/treasury/rwa' },
  { label: 'Dashboard',     href: '/treasury/dashboard' },
  { label: 'Send',          href: '/treasury/send' },
  { label: 'Receive',       href: '/treasury/receive' },
  { label: 'Swap',          href: '/treasury/swap' },
  { label: 'Transactions',  href: '/treasury/transactions' },
  { label: 'Workforce',     href: '/treasury/agents' },
  { label: 'Payroll',       href: '/treasury/payroll' },
  { label: 'Yield',         href: '/treasury/yield' },
  { label: 'Analytics',     href: '/treasury/analytics' },
  { label: 'P&L',           href: '/treasury/pnl' },
  { label: 'Tax',           href: '/treasury/tax' },
  { label: 'Policy',        href: '/treasury/policy' },
  { label: 'History',       href: '/treasury/history' },
  { label: 'Marketplace',   href: '/treasury/marketplace' },
  { label: 'Settings',      href: '/treasury/settings' },
]
const CREDIT_SUB: NavSubItem[] = [
  { label: 'Stake NCRD',      href: '/credit/stake' },
  { label: 'Credit Passport', href: '/credit/lend' },
  { label: 'DeFi Demo',       href: '/credit/lending-demo' },
]
const LEGACY_SUB: NavSubItem[] = [
  { label: 'Upload',     href: '/legacy/upload' },
  { label: 'Timeline',   href: '/legacy/timeline' },
  { label: 'Heir Access',href: '/legacy/heir' },
  { label: 'Validator',  href: '/legacy/validator' },
  { label: 'DLT Token',  href: '/legacy/tokenization' },
]
const AGENTS_SUB: NavSubItem[] = [
  { label: 'Explorer',      href: '/agents/explorer' },
  { label: 'Node Registry', href: '/agents/nodes' },
  { label: 'Deploy',        href: '/agents/deploy' },
  { label: 'Analytics',     href: '/agents/analytics' },
]

export interface NavCategory {
  key: string
  label: string
  icon: string
  color: string
  defaultHref: string
  items: NavItem[]
}

export const NAV_CATEGORIES: NavCategory[] = [
  {
    key: 'overview',
    label: 'Overview',
    icon: '⊞',
    color: '#3B5BFA',
    defaultHref: '/dashboard',
    items: [
      { label: 'Dashboard',      href: '/dashboard',     icon: '⊞', desc: 'Platform overview',       color: '#3B5BFA' },
      { label: 'Analytics',      href: '/analytics',     icon: '📊', desc: 'Predictive analytics',    color: '#3B5BFA' },
      { label: 'RWA Analytics',  href: '/rwa-analytics', icon: '📈', desc: 'Ecosystem impact',        color: '#f59e0b' },
      { label: 'Story',          href: '/story',         icon: '📖', desc: 'RWAkins journey',         color: '#3B5BFA' },
    ],
  },
  {
    key: 'ai-rwa',
    label: 'AI × RWA',
    icon: '◇',
    color: '#10b981',
    defaultHref: '/treasury',
    items: [
      { label: 'AI RWA Treasury', href: '/treasury',      icon: '◇', desc: 'USDY/mETH autonomous yield', color: '#10b981', children: TREASURY_SUB },
      { label: 'Agent Council',   href: '/agent-council', icon: '⬡', desc: '4-agent rebalance debate',   color: '#8b5cf6' },
    ],
  },
  {
    key: 'finance',
    label: 'Finance',
    icon: '◈',
    color: '#06b6d4',
    defaultHref: '/credit',
    items: [
      { label: 'Credit Passport', href: '/credit',  icon: '◈', desc: 'AI credit scoring (soulbound NFT)', color: '#06b6d4', children: CREDIT_SUB },
      { label: 'AI Lending',      href: '/lend',    icon: '◎', desc: 'DeFi loan negotiation',             color: '#f59e0b' },
      { label: 'Private Vault',   href: '/vault',   icon: '🔐', desc: 'Private on-chain trading',         color: '#14b8a6' },
      { label: 'Family Vault',    href: '/legacy',  icon: '⬟', desc: 'Encrypted inheritance',             color: '#f43f5e', children: LEGACY_SUB },
    ],
  },
  {
    key: 'defi-trading',
    label: 'DeFi & Trading',
    icon: '▲',
    color: '#8b5cf6',
    defaultHref: '/shadow',
    items: [
      { label: 'Stealth Suite', href: '/shadow',    icon: '▲',  desc: 'Autonomous DeFi execution',  color: '#8b5cf6' },
      { label: 'Executive',     href: '/executive', icon: '💼', desc: 'Executive operations view',  color: '#6366f1' },
      { label: 'Operations',    href: '/operations', icon: '⚙️', desc: 'Operational hub',           color: '#6366f1' },
      { label: 'Governance',    href: '/governance', icon: '🏛️', desc: 'Protocol governance',       color: '#8b5cf6' },
    ],
  },
  {
    key: 'recipients',
    label: 'Recipients',
    icon: '👥',
    color: '#f59e0b',
    defaultHref: '/agents',
    items: [
      { label: 'Agent Coordinator', href: '/agents',       icon: '⬡', desc: 'Deploy on-chain AI agents',   color: '#6366f1', children: AGENTS_SUB },
      { label: 'Coordination',      href: '/coordination', icon: '🔗', desc: 'Multi-agent coordination',   color: '#f59e0b' },
      { label: 'Policies',          href: '/policies',     icon: '📋', desc: 'Rule & policy management',   color: '#f59e0b' },
      { label: 'Bill Split',        href: '/split',        icon: '◆', desc: 'On-chain bill splitting',     color: '#3b82f6' },
    ],
  },
  {
    key: 'ai-agent',
    label: 'AI & Agent',
    icon: '🤖',
    color: '#6366f1',
    defaultHref: '/agent-council',
    items: [
      { label: 'Agent Council',     href: '/agent-council', icon: '⬡', desc: '4-agent voting council (ERC-8004)', color: '#8b5cf6' },
      { label: 'Agent Coordinator', href: '/agents',        icon: '⬡', desc: 'Deploy AI agents on Mantle',       color: '#6366f1', children: AGENTS_SUB },
      { label: 'Coordination',      href: '/coordination',  icon: '🔗', desc: 'Cross-agent coordination',        color: '#f59e0b' },
    ],
  },
  {
    key: 'security',
    label: 'Security',
    icon: '🛡️',
    color: '#ef4444',
    defaultHref: '/insurance-risk-system',
    items: [
      { label: 'Risk System',    href: '/insurance-risk-system',   icon: '🛡️', desc: '5-dimension portfolio risk',  color: '#ef4444' },
      { label: 'Compliance',     href: '/compliance',              icon: '⚖️', desc: 'KYC/AML regulatory framework', color: '#10B981' },
      { label: 'Audit Trail',    href: '/compliance/audit-trail',  icon: '📋', desc: 'On-chain agent decisions',     color: '#10B981' },
      { label: 'Contracts',      href: '/contracts',               icon: '📜', desc: 'Deployed Mantle contracts',    color: '#10b981' },
      { label: 'Security',       href: '/security',                icon: '🔒', desc: 'Platform security',           color: '#ef4444' },
    ],
  },
  {
    key: 'platform',
    label: 'Platform',
    icon: '⚡',
    color: '#3b82f6',
    defaultHref: '/developers',
    items: [
      { label: 'Developers',    href: '/developers',   icon: '💻', desc: 'API docs & SDKs',             color: '#3b82f6' },
      { label: 'Ecosystem',     href: '/ecosystem',    icon: '🌐', desc: 'Partner ecosystem',           color: '#8b5cf6' },
      { label: 'Protocols',     href: '/protocols',    icon: '⛓', desc: 'DeFi protocol integrations',  color: '#6366f1' },
      { label: 'Performance',   href: '/performance',  icon: '📊', desc: 'System performance',          color: '#3b82f6' },
      { label: 'Architecture',  href: '/architecture', icon: '🏗️', desc: 'System architecture',        color: '#3b82f6' },
      { label: 'Integrations',  href: '/integrations', icon: '🔌', desc: 'External integrations',      color: '#f59e0b' },
      { label: 'Compare',       href: '/compare',      icon: '⇌',  desc: 'vs alternatives',            color: '#6366f1' },
    ],
  },
]

// Returns the category key for a given pathname ('overview' as fallback)
export function getCategoryForPath(pathname: string): string {
  for (const cat of NAV_CATEGORIES) {
    if (cat.items.some(item => pathname === item.href || pathname.startsWith(item.href + '/'))) {
      return cat.key
    }
  }
  return 'overview'
}
