import { DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import GoogleAnalytics from '@/components/google-analytics'

export const dynamic = 'force-dynamic'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const jakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'Jariyah — Doa, Hadits, Zakat, Waris & Umrah Islami',
  description: 'Jariyah — Kumpulan doa harian dari Hisnul Muslim, Hadits Arbain An-Nawawi, kalkulator zakat & peternakan, kalkulator waris (faraidh), dan panduan umrah sesuai Al-Quran dan Sunnah.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Jariyah — Doa, Hadits, Zakat, Waris & Umrah Islami',
    description: 'Jariyah — Kumpulan doa harian dari Hisnul Muslim, Hadits Arbain An-Nawawi, kalkulator zakat & peternakan, kalkulator waris (faraidh), dan panduan umrah sesuai Al-Quran dan Sunnah.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B6B4A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Jariyah" />
      </head>
      <body className={`${dmSans.variable} ${jakartaSans.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <GoogleAnalytics />
        </ThemeProvider>
      </body>
    </html>
  )
}