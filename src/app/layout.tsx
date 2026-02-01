/* eslint-disable @next/next/no-page-custom-font */

export const dynamic = 'error'

import './globals.css'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { AppProviders } from './AppProviders'

export const metadata = {
  metadataBase: new URL('https://console.svc.plus'),
  title: {
    default: 'Cloud-Neutral | Unified Cloud Native Tools',
    template: '%s | Cloud-Neutral',
  },
  description: 'Unified tools for your cloud native stack. Manage infrastructure, deployments, and services across multiple cloud providers with a single, powerful platform.',
  keywords: ['cloud native', 'kubernetes', 'infrastructure', 'devops', 'cloud management', 'multi-cloud', 'platform engineering'],
  authors: [{ name: 'Cloud-Neutral Team' }],
  creator: 'Cloud-Neutral',
  publisher: 'Cloud-Neutral',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://console.svc.plus',
    title: 'Cloud-Neutral | Unified Cloud Native Tools',
    description: 'Unified tools for your cloud native stack. Manage infrastructure, deployments, and services across multiple cloud providers.',
    siteName: 'Cloud-Neutral',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloud-Neutral | Unified Cloud Native Tools',
    description: 'Unified tools for your cloud native stack',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const htmlAttributes = { lang: 'en' }
const bodyClassName = 'bg-[var(--color-background)] text-[var(--color-text)]'
const GA_ID = 'G-T4VM8G4Q42'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html {...htmlAttributes}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Cloud-Neutral',
              url: 'https://console.svc.plus',
              logo: 'https://console.svc.plus/logo.png',
              description: 'Unified tools for your cloud native stack',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Cloud-Neutral',
              url: 'https://console.svc.plus',
              description: 'Unified tools for your cloud native stack',
            }),
          }}
        />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "CF_TOKEN_PLACEHOLDER"}'
          strategy="afterInteractive"
        />
      </head>
      <body className={bodyClassName}>
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  )
}
