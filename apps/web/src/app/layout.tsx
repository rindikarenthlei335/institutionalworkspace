import type { Metadata } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'EduPortal - Multi-Tenant School Platform',
  description: 'Complete SaaS web and app platform for schools and institutions'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
