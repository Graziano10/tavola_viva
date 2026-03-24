import Link from 'next/link';

import { MenuCard } from '@/components/menu-card';
import { SectionHeading } from '@/components/section-heading';
import { getMenu } from '@/lib/data';

export const dynamic = 'force-dynamic';
export default async function HomePage() {
  const categories = await getMenu();

  return (
    <div className="container-shell space-y-16 py-16">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-amber-200">
            Digital restaurant platform
          </span>
          <h1 className="text-5xl font-semibold leading-tight text-white sm:text-6xl">
            Tavola Viva: menu dinamico, ordini online e prenotazioni senza attrito.
          </h1>
          <p className="max-w-2xl text-lg text-stone-300">
            Stack moderno con Next.js App Router, TypeScript, Prisma, PostgreSQL e Docker,
            progettato per performance, SEO, sicurezza e scalabilità futura.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/menu" className="rounded-full bg-amber-300 px-6 py-3 font-semibold text-stone-950">
              Esplora menu
            </Link>
            <Link href="/order" className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white">
              Ordina ora
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-amber-300/20 via-orange-500/10 to-transparent p-8 shadow-2xl shadow-black/30">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['SEO-first menu', 'Slug parlanti, metadata dinamici e rendering server-side.'],
              ['Checkout rapido', 'Carrello persistente e validazioni robuste lato client/server.'],
              ['Prenotazioni smart', 'Fasce orarie e blocco overbooking integrato.'],
              ['Admin sicuro', 'Sessioni httpOnly, rate limit e protezione route/API.'],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-stone-950/60 p-5">
                <h2 className="font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm text-stone-300">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Menu"
          title="Categorie del menu indicizzabili"
          description="Ogni categoria ha uno slug SEO-friendly e può essere gestita dall’admin panel con disponibilità in tempo reale."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {categories.map((category) => (
            <MenuCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </div>
  );
}
