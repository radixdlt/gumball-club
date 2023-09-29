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
      <Script id="google-analytics">
        {`
          (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
            var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s),
              dl = l != "dataLayer" ? "&l=" + l : "";
            j.async = true;
            j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
            f.parentNode.insertBefore(j, f);
          })(window, document, "script", "dataLayer", "GTM-PKNDV4C");
        `}
      </Script>
      <Head>
        <meta property="og:title" content="Gumball Club | Try Web3 on Radix" />
        <meta
          property="og:description"
          content="Experience your first transactions with the Radix Wallet in a playful and safe environment."
        />
        <meta
          property="og:image"
          content="https://assets.radixdlt.com/images/dApps/og-gumball-club.webp"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <body className={font.className}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PKNDV4C"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {children}
      </body>
    </html>
  )
}
