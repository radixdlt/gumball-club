import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const font = Inter({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Gumball Club",
  description: "A playground to experience Web3 using the Radix Wallet",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  )
}
