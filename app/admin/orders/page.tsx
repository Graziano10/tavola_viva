import { requireAdminSession } from '@/lib/auth';
import { getDashboardData } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Admin orders',
  robots: { index: false, follow: false },
};

export default async function AdminOrdersPage() {
  await requireAdminSession();
  const { orders } = await getDashboardData();

  return (
    <div className="container-shell py-16">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-3xl font-semibold text-white">Gestione ordini</h1>
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-stone-950/70 text-stone-400">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Stato</th>
                <th className="px-4 py-3">Totale</th>
                <th className="px-4 py-3">Creato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-white/5 text-stone-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{order.status}</td>
                  <td className="px-4 py-3">€ {(order.totalCents / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {new Intl.DateTimeFormat('it-IT', { dateStyle: 'short', timeStyle: 'short' }).format(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
