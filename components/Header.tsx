'use client';
import Link from 'next/link';
import { useState } from 'react';
const links = [['/designs', 'Designs'], ['/#packages', 'Packages'], ['/about', 'About'], ['/contact', 'Contact']];
export default function Header({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-serif text-2xl font-semibold text-maroon">{name}</Link>
        <nav className="hidden gap-8 text-sm md:flex" aria-label="Main">
          {links.map(([h, l]) => <Link key={h} href={h} className="transition hover:text-gold">{l}</Link>)}
          <Link href="/contact" className="btn btn-primary !py-2">Book Now</Link>
        </nav>
        <button className="md:hidden p-2" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span className="block h-0.5 w-6 bg-maroon mb-1.5" /><span className="block h-0.5 w-6 bg-maroon mb-1.5" /><span className="block h-0.5 w-6 bg-maroon" />
        </button>
      </div>
      {open && <nav className="flex flex-col gap-4 border-t border-gold/20 px-5 py-5 md:hidden" aria-label="Mobile">
        {links.map(([h, l]) => <Link key={h} href={h} onClick={() => setOpen(false)}>{l}</Link>)}
        <Link href="/contact" onClick={() => setOpen(false)} className="btn btn-primary">Book Now</Link>
      </nav>}
    </header>
  );
}
