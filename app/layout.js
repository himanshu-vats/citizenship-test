import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";

export const metadata = {
  metadataBase: new URL('https://civicspass.com'),
  title: 'US Citizenship Test Practice 2025 | Free USCIS Civics Test Prep - CivicsPass',
  description: 'Free US citizenship test practice with official USCIS questions. Study 2025 & 2008 test versions with flashcards, practice tests, and personalized learning. Pass your naturalization interview with confidence.',
  keywords: 'US citizenship test, USCIS civics test, naturalization test, citizenship practice test, civics test 2025, N-400 test prep, citizenship interview questions, USCIS test questions, naturalization interview, citizenship exam',
  authors: [{ name: 'CivicsPass' }],
  creator: 'CivicsPass',
  publisher: 'CivicsPass',
  openGraph: {
    title: 'CivicsPass - Free US Citizenship Test Practice',
    description: 'Master the USCIS citizenship test with free practice tests, flashcards, and study guides. Official 2025 & 2008 civics questions.',
    url: 'https://civicspass.com',
    siteName: 'CivicsPass',
    locale: 'en_US',
    type: 'website',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'CivicsPass - US Citizenship Test Practice',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CivicsPass - Free US Citizenship Test Practice',
    description: 'Master the USCIS citizenship test with free practice tests and flashcards',
    images: ['/og-image.png'],
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
  alternates: {
    canonical: 'https://civicspass.com',
  },
  verification: {
    // Add your verification codes here when you get them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />

        {/* Mobile Web App Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Citizenship" />
      </head>
      <body className="antialiased bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 transition-colors" suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}