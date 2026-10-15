import Link from 'next/link';
import DesignCard from '@/components/DesignCard';
import PriceNotice from '@/components/PriceNotice';
import { getCategories, getDesigns, getPackages, getSettings, getTestimonials } from '@/lib/db';
import { priceLabel, waLink } from '@/lib/utils';

export default function Home() {
  const s = getSettings(), cats = getCategories(), designs = getDesigns(), pk = getPackages(), tm = getTestimonials();
  const catById = Object.fromEntries(cats.map((c) => [c.id, c.name]));
  const featured = designs.filter((d) => d.featured).slice(0, 8);
  const gallery = designs.filter((d) => d.featured).slice(0, 8);
  const ig = `https://instagram.com/${s.instagram_user}`;
  const ld = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: s.business_name, description: s.intro, telephone: s.phone, areaServed: s.locations.split(',').map((x) => x.trim()), sameAs: [ig] };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="relative overflow-hidden bg-maroon text-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-24">
          <div className="animate-rise">
            <p className="eyebrow">{s.business_name} · Mehndi Artist</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl">{s.tagline}</h1>
            <p className="mt-5 max-w-lg text-beige/90">{s.intro}</p>
            <p className="mt-4 text-sm text-gold-light">📍 {s.locations.split(',').map((x) => x.trim()).join('  ·  ')}</p>
            <p className="mt-1 text-sm text-beige/70">Instagram {s.instagram_followers} followers</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/designs" className="btn btn-gold">Explore Designs</Link>
              <Link href="#packages" className="btn border border-gold/60 text-gold-light hover:bg-gold hover:text-maroon-dark">View Packages</Link>
              <a href={waLink(s.whatsapp, 'Hi! I would like to book mehndi.')} target="_blank" rel="noopener noreferrer" className="btn btn-wa">Book on WhatsApp</a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md animate-rise [animation-delay:.15s]">
            <div className="absolute -inset-3 rounded-[2rem] border border-gold/50" aria-hidden />
            <img src="/portfolio/m186.webp" alt="Bridal mehndi on both palms with glass bangles" className="relative aspect-[4/5] w-full rounded-[1.7rem] object-cover" fetchPriority="high" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20" aria-labelledby="cats">
        <p className="eyebrow text-center">Portfolio</p>
        <h2 id="cats" className="h-display mt-2 text-center text-4xl">Mehndi for Every Occasion</h2>
        <div className="orn mx-auto mt-5 w-40" />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {cats.map((c) => (
            <Link key={c.id} href={`/designs?cat=${c.slug}`} className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
              <img src={c.cover} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/90 via-transparent" />
              <span className="absolute bottom-3 left-3 right-3 font-serif text-lg leading-tight text-cream">{c.name}</span>
            </Link>))}
        </div>
      </section>

      {featured.length > 0 && <section className="mx-auto max-w-6xl px-5 pt-24" aria-labelledby="feat">
        <p className="eyebrow text-center">Handpicked</p>
        <h2 id="feat" className="h-display mt-2 text-center text-4xl">Featured Designs</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">{featured.map((d) => <DesignCard key={d.id} d={d} cat={catById[d.category_id]} />)}</div>
        <div className="mt-10 text-center"><Link href="/designs" className="btn btn-outline">See All Designs</Link></div>
      </section>}

      <section id="packages" className="mt-24 scroll-mt-20 bg-beige/60 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="eyebrow text-center">Packages</p>
          <h2 className="h-display mt-2 text-center text-4xl">Services &amp; Pricing</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {pk.map((p) => (
              <div key={p.id} className="flex flex-col rounded-2xl border border-gold/30 bg-cream p-6">
                <h3 className="font-serif text-2xl text-maroon">{p.name}</h3>
                <p className="mt-2 text-2xl font-semibold text-gold">{priceLabel(p.price, p.starting)}</p>
                <p className="mt-2 text-sm text-earth">{p.description}</p>
                <ul className="mt-4 flex-1 space-y-1 text-sm">{p.features.split('\n').filter(Boolean).map((f) => <li key={f}>✦ {f}</li>)}</ul>
                <Link href={`/contact?package=${encodeURIComponent(p.name)}`} className="btn btn-primary mt-6">Enquire</Link>
              </div>))}
          </div>
          <PriceNotice />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24" aria-labelledby="ig">
        <p className="eyebrow text-center">Instagram · {s.instagram_followers} followers</p>
        <h2 id="ig" className="h-display mt-2 text-center text-4xl">@{s.instagram_user}</h2>
        <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-4">
          {gallery.map((d) => <a key={d.id} href={ig} target="_blank" rel="noopener noreferrer" className="aspect-square overflow-hidden rounded-xl"><img src={d.thumb} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-105" /></a>)}
        </div>
        <div className="mt-8 text-center"><a href={ig} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Follow on Instagram</a></div>
      </section>

      {tm.length > 0 && <section className="mx-auto max-w-6xl px-5 pt-24" aria-labelledby="tm">
        <h2 id="tm" className="h-display text-center text-4xl">Happy Clients</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">{tm.map((t) => (
          <figure key={t.id} className="rounded-2xl border border-beige bg-white p-6"><blockquote className="text-earth">“{t.text}”</blockquote>
            <figcaption className="mt-4 text-sm font-medium text-maroon">{t.name}{t.location && `, ${t.location}`}</figcaption></figure>))}</div>
      </section>}

      <section className="mx-auto mt-24 max-w-4xl rounded-3xl bg-maroon px-6 py-14 text-center text-cream">
        <h2 className="font-serif text-4xl">Let&apos;s Make Your Moment Beautiful</h2>
        <p className="mx-auto mt-3 max-w-xl text-beige/80">Tell us your date, place and favourite design. We&apos;ll reply with availability and a personalised quote.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href={waLink(s.whatsapp, 'Hi! I would like to book mehndi.')} target="_blank" rel="noopener noreferrer" className="btn btn-wa">Book on WhatsApp</a>
          <Link href="/contact" className="btn btn-gold">Send an Enquiry</Link>
        </div>
      </section>
    </>
  );
}
