// Built by vsrupeshkumar
export type StakingTier = 'None' | 'Bronze' | 'Silver' | 'Gold'

export const STAKING_TIERS = {
  Bronze: { required: 500, boost: 50, color: '#F97316', emoji: '🥉' },
  Silver: { required: 2000, boost: 150, color: '#9CA3AF', emoji: '🥈' },
  Gold: { required: 10000, boost: 300, color: '#F5C518', emoji: '🥇' },
} as const

export function getRating(score: number): { label: string; color: string } {
  if (score <= 400) return { label: 'Poor', color: '#EF4444' }
  if (score <= 600) return { label: 'Fair', color: '#F97316' }
  if (score <= 750) return { label: 'Good', color: '#86EFAC' }
  if (score <= 900) return { label: 'Very Good', color: '#22C55E' }
  return { label: 'Excellent', color: '#10B981' }
}

export const fallbackScore = {
  address: '',
  score: 650,
  riskBand: 2,
  explanation: 'Based on on-chain analysis',
  transactionHash: '',
}

export const fallbackBreakdown = {
  score: 650,
  baseScore: 500,
  stakingBoost: 0,
  oraclePenalty: 0,
  stakingTier: 'None' as StakingTier,
  lastUpdated: new Date().toISOString(),
}

export const fallbackStaking = {
  stakedAmount: 0,
  availableBalance: 0,
  currentTier: 'None' as StakingTier,
  scoreBoost: 0,
  progressToNextTier: 0,
  nextTierRequired: 500,
  nextTierName: 'Bronze',
}

export const ORACLE_PRICE_FALLBACK = 2.45

export const fallbackLoanOffers = [
  {
    id: 'offer-1',
    loanAmount: 1000,
    interestRate: 8.5,
    collateralRequired: 1500,
    duration: 12,
    ltv: 150,
    recommendation: 'Recommended for your risk profile',
  },
  {
    id: 'offer-2',
    loanAmount: 5000,
    interestRate: 6.5,
    collateralRequired: 6250,
    duration: 24,
    ltv: 125,
    recommendation: 'Best value',
  },
  {
    id: 'offer-3',
    loanAmount: 10000,
    interestRate: 4.8,
    collateralRequired: 10000,
    duration: 36,
    ltv: 100,
    recommendation: 'Available based on your score',
  },
]

export const MOCK_AI_RESPONSES = [
  'Based on your credit score of 650, I can offer you a loan at 6.5% APR with 125% collateral.',
  'Your score qualifies you for Silver tier lending. You could borrow up to $5,000 USDC.',
  'To improve your loan terms, consider staking more NCRD tokens to boost your score.',
  'With a score of 650, you qualify for 12–36 month terms. Longer terms mean lower monthly payments.',
  'I recommend the Balanced Loan at $5,000 with 6.5% APR — it provides the best value for your profile.',
]

export const CHAT_GREETING =
  "Hello! I'm your Credit Passport AI Assistant. I can help you get a personalized loan based on your Credit Passport score. How can I help you today?"

export const SCENARIO_LABELS: Record<string, string> = {
  repayment: 'Loan Repayment',
  staking: 'Staking Tokens',
  transactions: 'Increased Transaction Volume',
  diversification: 'Portfolio Diversification',
}

export const SCENARIO_DESCRIPTIONS: Record<string, string> = {
  repayment: 'Repay a $5K loan on-chain',
  staking: 'Stake 500 NCRD tokens',
  transactions: '10× more transactions',
  diversification: 'Diversify to 5 assets',
}
