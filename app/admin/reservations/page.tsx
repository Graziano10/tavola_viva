import { requireAdminSession } from '@/lib/auth';
import { getDashboardData } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Admin reservations',
  robots: { index: false, follow: false },
};

export default async function AdminReservationsPage() {
  await requireAdminSession();
  const { reservations } = await getDashboardData();

  return (
    <div className="container-shell py-16">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-3xl font-semibold text-white">Gestione prenotazioni</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {reservations.map((reservation) => (
            <article key={reservation.id} className="rounded-2xl bg-stone-950/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{reservation.customerName}</p>
                  <p className="text-sm text-stone-400">{reservation.customerEmail}</p>
                </div>
                <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs text-emerald-300">
                  {reservation.partySize} coperti
                </span>
              </div>
              <p className="mt-3 text-sm text-stone-300">
                {new Intl.DateTimeFormat('it-IT', { dateStyle: 'full', timeStyle: 'short' }).format(
                  reservation.reservationAt,
                )}
              </p>
              {reservation.notes ? <p className="mt-2 text-sm text-stone-400">{reservation.notes}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
