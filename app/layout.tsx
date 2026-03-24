import type { Metadata } from 'next';

import './globals.css';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Tavola Viva | Ristorante moderno',
    template: '%s | Tavola Viva',
  },
  description:
    'Web app production-ready per ristorante con menu dinamico, ordini online, prenotazioni e pannello amministrativo.',
  keywords: ['ristorante', 'menu online', 'prenotazioni', 'ordini', 'next.js', 'prisma'],
  openGraph: {
    title: 'Tavola Viva',
    description:
      'Esperienza digitale per ristoranti: menu SEO-first, checkout rapido e prenotazioni con anti-overbooking.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
