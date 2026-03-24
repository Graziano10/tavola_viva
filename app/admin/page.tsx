import Link from 'next/link';

import { requireAdminSession } from '@/lib/auth';
import { getDashboardData } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Admin dashboard',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  await requireAdminSession();
  const { orders, reservations, categories } = await getDashboardData();

  return (
    <div className="container-shell space-y-8 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Pannello protetto</p>
          <h1 className="text-4xl font-semibold text-white">Controllo operativo</h1>
        </div>
        <form action="/api/admin/logout" method="post">
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">Logout</button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Categorie menu', String(categories.length), '/admin/menu'],
          ['Ordini recenti', String(orders.length), '/admin/orders'],
          ['Prenotazioni', String(reservations.length), '/admin/reservations'],
        ].map(([title, value, href]) => (
          <Link key={title} href={href} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-stone-400">{title}</p>
            <p className="mt-2 text-4xl font-semibold text-white">{value}</p>
          </Link>
        ))}
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold text-white">Ordini recenti</h2>
          <div className="mt-4 space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl bg-stone-950/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{order.customerName}</p>
                    <p className="text-xs text-stone-400">{order.customerEmail}</p>
                  </div>
                  <span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs text-amber-300">
                    {order.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-stone-300">Totale € {(order.totalCents / 100).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold text-white">Prenotazioni imminenti</h2>
          <div className="mt-4 space-y-3">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="rounded-2xl bg-stone-950/60 p-4">
                <p className="font-medium text-white">{reservation.customerName}</p>
                <p className="text-sm text-stone-400">
                  {new Intl.DateTimeFormat('it-IT', { dateStyle: 'medium', timeStyle: 'short' }).format(
                    reservation.reservationAt,
                  )}
                </p>
                <p className="text-sm text-stone-300">Coperti: {reservation.partySize}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
