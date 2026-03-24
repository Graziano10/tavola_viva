import Link from 'next/link';

import type { Category, MenuItem, MenuItemVariant } from '@prisma/client';

type Item = MenuItem & { variants: MenuItemVariant[] };

type CategoryWithItems = Category & { items: Item[] };

export function MenuCard({ category }: { category: CategoryWithItems }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-white">{category.name}</h3>
          <p className="mt-2 text-sm text-stone-300">{category.description}</p>
        </div>
        <Link href={`/menu/${category.slug}`} className="text-sm font-medium text-amber-300 hover:text-amber-200">
          Apri categoria
        </Link>
      </div>
      <div className="space-y-4">
        {category.items.slice(0, 4).map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-stone-950/60 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-medium text-white">{item.name}</h4>
                <p className="mt-1 text-sm text-stone-400">{item.description}</p>
              </div>
              <p className="text-sm font-semibold text-amber-300">€ {(item.priceCents / 100).toFixed(2)}</p>
            </div>
            {item.variants.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2 text-xs text-stone-300">
                {item.variants.map((variant) => (
                  <li key={variant.id} className="rounded-full bg-white/5 px-3 py-1">
                    {variant.name}
                    {variant.priceDeltaCents > 0 ? ` · +€ ${(variant.priceDeltaCents / 100).toFixed(2)}` : ''}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </article>
  );
}
