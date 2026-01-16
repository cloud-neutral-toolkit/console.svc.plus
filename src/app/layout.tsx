export const dynamic = 'error'

import './globals.css'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { AppProviders } from './AppProviders'

export const metadata = {
  title: 'Cloud-Neutral',
  description: 'Unified tools for your cloud native stack',
}

const htmlAttributes = { lang: 'en' }
const bodyClassName = 'bg-[var(--color-background)] text-[var(--color-text)]'
const GA_ID = 'G-T4VM8G4Q42'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html {...htmlAttributes}>
      <head>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body className={bodyClassName}>
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  )
}
