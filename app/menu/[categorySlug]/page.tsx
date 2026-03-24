import { notFound } from 'next/navigation';

import { getMenuCategoryBySlug } from '@/lib/data';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  const category = await getMenuCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: 'Categoria non trovata',
    };
  }

  return {
    title: category.name,
    description: category.description ?? `Scopri ${category.name} nel menu Tavola Viva.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  const category = await getMenuCategoryBySlug(categorySlug);
  if (!category) notFound();

  return (
    <div className="container-shell py-16">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <h1 className="text-4xl font-semibold text-white">{category.name}</h1>
        <p className="mt-3 max-w-3xl text-stone-300">{category.description}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {category.items.map((item) => (
            <article key={item.id} className="rounded-3xl border border-white/10 bg-stone-950/60 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-medium text-white">{item.name}</h2>
                  <p className="mt-2 text-sm text-stone-400">{item.description}</p>
                </div>
                <p className="text-sm font-semibold text-amber-300">€ {(item.priceCents / 100).toFixed(2)}</p>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-stone-300">
                <li>Disponibilità: {item.isAvailable ? 'Disponibile' : 'Non disponibile'}</li>
                <li>Tempo medio: {item.preparationTimeMin} minuti</li>
                {item.variants.map((variant) => (
                  <li key={variant.id}>
                    Variante {variant.name} · {variant.priceDeltaCents >= 0 ? '+' : ''}€ {(
                      variant.priceDeltaCents / 100
                    ).toFixed(2)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
