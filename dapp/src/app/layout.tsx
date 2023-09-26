import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import Script from 'next/script'

const font = Inter({
  weight: ['400', '600'],
  style: ['normal'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Gumball Club | Try Web3 on Radix',
  description:
    'Experience your first transactions with the Radix Wallet in a playful and safe environment.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Script src="https://www.googletagmanager.com/gtag/js?id=GTM-PKNDV4C" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'GTM-PKNDV4C');
        `}
      </Script>
      <Head>
        <meta
          property="og:image"
          content="https://gumball-club.radixdlt.com/assets/og.webp"
        />
        <meta property="og:title" content="Gumball Club | Try Web3 on Radix" />
        <meta
          property="og:description"
          content="Experience your first transactions with the Radix Wallet in a playful and safe environment."
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <body className={font.className}>{children}</body>
    </html>
  )
}
