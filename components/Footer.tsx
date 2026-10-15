import Link from 'next/link';
import { waLink } from '@/lib/utils';
export default function Footer({ s }: { s: Record<string, string> }) {
  return (
    <>
      <a href={waLink(s.whatsapp, 'Hi! I would like to enquire about mehndi.')} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-40 rounded-full bg-[#1f8f4d] px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:scale-105">WhatsApp</a>
      <footer className="mt-24 bg-maroon-dark text-beige">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
          <div><p className="font-serif text-2xl text-gold-light">{s.business_name}</p><p className="mt-3 text-sm opacity-80">{s.intro}</p></div>
          <div className="text-sm"><p className="eyebrow mb-3">Explore</p>
            <ul className="space-y-2"><li><Link href="/designs">Designs</Link></li><li><Link href="/about">About</Link></li><li><Link href="/contact">Book / Contact</Link></li></ul></div>
          <div className="text-sm"><p className="eyebrow mb-3">Reach us</p>
            <p>Serving {s.locations}</p>
            <p className="mt-2"><a href={`https://instagram.com/${s.instagram_user}`} target="_blank" rel="noopener noreferrer">Instagram @{s.instagram_user}</a></p>
            <p className="mt-2"><a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a></p></div>
        </div>
        <p className="border-t border-white/10 py-5 text-center text-xs opacity-60">© {new Date().getFullYear()} {s.business_name}. All photographs are the artist&apos;s own work.</p>
      </footer>
    </>
  );
}
