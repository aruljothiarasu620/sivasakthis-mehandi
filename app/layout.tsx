import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSettings } from '@/lib/db';
export const dynamic = 'force-dynamic';
const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Sivasakthi's Mehandi | Bridal Mehndi Artist in Pondicherry, Villupuram & Cuddalore", template: "%s | Sivasakthi's Mehandi" },
  description: 'Professional bridal, Arabic, engagement and festival mehndi artist serving Pondicherry, Villupuram and Cuddalore. Browse designs, see prices and book on WhatsApp.',
  openGraph: { type: 'website', images: ['/portfolio/m186.webp'] },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const s = getSettings();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">Skip to content</a>
        <Header name={s.business_name} />
        <main id="main">{children}</main>
        <Footer s={s} />
      </body>
    </html>
  );
}
