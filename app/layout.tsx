import './globals.css'

export const metadata = {
  title: 'Background Remover',
  description: 'Remove image backgrounds instantly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
