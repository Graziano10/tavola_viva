import { MenuCard } from '@/components/menu-card';
import { SectionHeading } from '@/components/section-heading';
import { getMenu } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Menu',
  description: 'Menu dinamico del ristorante Tavola Viva con categorie indicizzabili e disponibilità live.',
};

export default async function MenuPage() {
  const categories = await getMenu();

  return (
    <div className="container-shell space-y-8 py-16">
      <SectionHeading
        eyebrow="Menu dinamico"
        title="Piatti e varianti sempre aggiornati"
        description="Il catalogo viene servito con SSR e dati dal database, ideale per SEO e aggiornamenti in tempo reale della disponibilità."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {categories.map((category) => (
          <MenuCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
