import { requireAdminSession } from '@/lib/auth';
import { getDashboardData } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Admin menu',
  robots: { index: false, follow: false },
};

export default async function AdminMenuPage() {
  await requireAdminSession();
  const { categories } = await getDashboardData();

  return (
    <div className="container-shell py-16">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-3xl font-semibold text-white">CRUD menu</h1>
        <p className="mt-2 text-stone-300">
          Le modifiche operative sono esposte via API sicure (`/api/menu/categories` e `/api/menu/items`) con validazione Zod.
        </p>
        <div className="mt-6 space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="rounded-2xl bg-stone-950/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{category.name}</p>
                  <p className="text-sm text-stone-400">/{category.slug}</p>
                </div>
                <p className="text-sm text-stone-300">{category.items.length} prodotti</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
