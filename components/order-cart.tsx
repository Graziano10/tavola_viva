'use client';

import { useEffect, useMemo, useState } from 'react';

import type { Category, MenuItem, MenuItemVariant } from '@prisma/client';

type CartLine = {
  menuItemId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
};

type CategoryWithItems = Category & {
  items: (MenuItem & { variants: MenuItemVariant[] })[];
};

const storageKey = 'tv_cart';

export function OrderCart({ categories }: { categories: CategoryWithItems[] }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [formState, setFormState] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
  });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) setCart(JSON.parse(stored) as CartLine[]);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart]);

  const total = useMemo(
    () => cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    [cart],
  );

  const addItem = (item: MenuItem, variant?: MenuItemVariant) => {
    const key = `${item.id}:${variant?.id ?? 'base'}`;
    setCart((current) => {
      const existing = current.find(
        (line) => `${line.menuItemId}:${line.variantId ?? 'base'}` === key,
      );
      if (existing) {
        return current.map((line) =>
          `${line.menuItemId}:${line.variantId ?? 'base'}` === key
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      }
      return [
        ...current,
        {
          menuItemId: item.id,
          variantId: variant?.id,
          name: item.name,
          variantName: variant?.name,
          unitPrice: item.priceCents + (variant?.priceDeltaCents ?? 0),
          quantity: 1,
        },
      ];
    });
  };

  const submitOrder = async () => {
    setMessage(null);
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formState,
        notes: formState.notes || null,
        items: cart.map((line) => ({
          menuItemId: line.menuItemId,
          variantId: line.variantId ?? null,
          quantity: line.quantity,
        })),
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setMessage(data.error ?? 'Ordine non inviato');
      return;
    }

    setCart([]);
    setFormState({ customerName: '', customerEmail: '', customerPhone: '', notes: '' });
    setMessage('Ordine inviato con successo. Ti contatteremo a breve.');
    window.localStorage.removeItem(storageKey);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
      <section className="space-y-6">
        {categories.map((category) => (
          <div key={category.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold text-white">{category.name}</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {category.items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-stone-950/60 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-white">{item.name}</h4>
                      <p className="mt-1 text-sm text-stone-400">{item.description}</p>
                    </div>
                    <p className="text-sm font-semibold text-amber-300">€ {(item.priceCents / 100).toFixed(2)}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => addItem(item)}
                      className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-200"
                    >
                      Aggiungi
                    </button>
                    {item.variants.map((variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => addItem(item, variant)}
                        className="rounded-full border border-white/10 px-3 py-2 text-xs text-stone-200 hover:border-amber-300 hover:text-amber-300"
                      >
                        {variant.name} · +€ {(variant.priceDeltaCents / 100).toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6 lg:sticky lg:top-6">
        <h3 className="text-xl font-semibold text-white">Carrello persistente</h3>
        <div className="mt-4 space-y-3">
          {cart.length === 0 ? <p className="text-sm text-stone-400">Nessun prodotto selezionato.</p> : null}
          {cart.map((line) => (
            <div key={`${line.menuItemId}:${line.variantId ?? 'base'}`} className="rounded-2xl bg-stone-950/60 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-white">{line.name}</p>
                  {line.variantName ? <p className="text-xs text-stone-400">{line.variantName}</p> : null}
                </div>
                <p className="text-sm text-stone-300">x{line.quantity}</p>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-stone-400">
                <span>€ {(line.unitPrice / 100).toFixed(2)} cad.</span>
                <button
                  type="button"
                  onClick={() =>
                    setCart((current) => current.filter((entry) => entry !== line))
                  }
                  className="text-red-300 hover:text-red-200"
                >
                  Rimuovi
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-lg font-semibold text-amber-300">Totale € {(total / 100).toFixed(2)}</p>

        <div className="mt-6 space-y-3">
          {[
            ['customerName', 'Nome'],
            ['customerEmail', 'Email'],
            ['customerPhone', 'Telefono'],
          ].map(([field, label]) => (
            <label key={field} className="block text-sm text-stone-200">
              {label}
              <input
                className="mt-1 w-full rounded-2xl border border-white/10 bg-stone-950 px-4 py-3 text-white outline-none ring-0"
                value={formState[field as keyof typeof formState]}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, [field]: event.target.value }))
                }
              />
            </label>
          ))}
          <label className="block text-sm text-stone-200">
            Note
            <textarea
              className="mt-1 min-h-24 w-full rounded-2xl border border-white/10 bg-stone-950 px-4 py-3 text-white outline-none"
              value={formState.notes}
              onChange={(event) => setFormState((current) => ({ ...current, notes: event.target.value }))}
            />
          </label>
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={submitOrder}
            className="w-full rounded-2xl bg-amber-300 px-4 py-3 font-semibold text-stone-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Conferma checkout
          </button>
          {message ? <p className="text-sm text-stone-300">{message}</p> : null}
        </div>
      </aside>
    </div>
  );
}
