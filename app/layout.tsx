import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GPACalc',
  description: 'github.com/emirhanersoy',
  generator: 'emirhanersoy',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
