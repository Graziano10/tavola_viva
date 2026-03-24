import { OrderCart } from '@/components/order-cart';
import { SectionHeading } from '@/components/section-heading';
import { getMenu } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Ordina online',
  description: 'Checkout digitale con carrello persistente, disponibilità real-time e gestione stati ordine.',
};

export default async function OrderPage() {
  const categories = await getMenu();

  return (
    <div className="container-shell space-y-8 py-16">
      <SectionHeading
        eyebrow="Ordini online"
        title="Checkout rapido e persistente"
        description="Il carrello resta disponibile nel browser e il backend valida disponibilità e prezzi prima della conferma."
      />
      <OrderCart categories={categories} />
    </div>
  );
}
