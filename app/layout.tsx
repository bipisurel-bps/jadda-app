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
  title: {
    default: 'Jadda (جدّ) — Doa Harian, Hadits, Zakat, Waris & Umrah Islami',
    template: '%s | Jadda',
  },
  description: 'Jadda — Aplikasi Islami ringkas berbahasa Indonesia: jadwal sholat, arah kiblat (kompas), 310 doa harian dari Hisnul Muslim, 42 Hadits Arbain An-Nawawi, kalkulator zakat (maal, fitrah, perdagangan, pertanian, peternakan), kalkulator waris (faraidh), dan panduan umrah & haji lengkap sesuai Al-Quran dan Sunnah.',
  keywords: ['doa harian islam', 'hisnul muslim', 'hadits arbain', 'kalkulator zakat', 'kalkulator waris', 'faraidh', 'panduan umrah', 'panduan haji', 'arah kiblat', 'qibla compass', 'kompas kiblat', 'jadwal sholat', 'aplikasi islami', 'jadda', 'dzikir pagi petang', 'doa sehari-hari'],
  authors: [{ name: 'Jadda', url: 'https://jadda.app' }],
  creator: 'Jadda',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/logo-jadda.png',
  },
  openGraph: {
    title: 'Jadda (جدّ) — Doa Harian, Hadits, Zakat, Waris & Umrah Islami',
    description: 'Aplikasi Islami ringkas: 309 doa harian Hisnul Muslim, 42 Hadits Arbain, kalkulator zakat & waris, dan panduan umrah sesuai Al-Quran dan Sunnah.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Jadda',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Jadda - Aplikasi Islami Ringkas' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jadda (جدّ) — Aplikasi Islami Ringkas',
    description: 'Doa harian, hadits, kalkulator zakat & waris, panduan umrah sesuai Al-Quran dan Sunnah.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
  category: 'religion',
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
        <meta name="apple-mobile-web-app-title" content="Jadda" />
        <meta name="google-site-verification" content="pbdM9cP7IfWM_qJUvezn7r2WGm1jHMdRqCnNWyYipWA" />
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