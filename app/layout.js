import "./globals.css";

export const metadata = {
  title: "US Citizenship Test 2025",
  description: "Practice for your US citizenship test with official USCIS questions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}