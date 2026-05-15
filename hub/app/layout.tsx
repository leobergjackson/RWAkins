import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Kubryx — Multi-Chain AI Financial Super-App',
  description: 'Eight live blockchain products. Credit scoring, digital inheritance, private trading, DeFi lending, autonomous treasury & AI agents. QIE, Solana, Stellar, Ethereum.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111',
              border: '1px solid rgba(245,197,24,0.2)',
              color: '#fff',
              fontFamily: 'Satoshi, sans-serif',
            },
          }}
        />
      </body>
    </html>
  )
}
