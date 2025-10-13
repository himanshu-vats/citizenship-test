import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata = {
  title: "US Citizenship Test Prep - 2008 & 2025 USCIS Questions | Free Practice",
  description: "Pass your USCIS civics test! Practice with official questions from both 2008 (100Q) and 2025 (128Q) test versions. Study mode, practice tests, personalized for your state. Start free, unlock unlimited for $14.99.",
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
      <body className="antialiased pb-16" suppressHydrationWarning>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}