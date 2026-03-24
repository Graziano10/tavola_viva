import { ReservationForm } from '@/components/reservation-form';
import { SectionHeading } from '@/components/section-heading';

export const metadata = {
  title: 'Prenotazioni',
  description: 'Prenota un tavolo con fasce orarie gestite a database e logica anti-overbooking.',
};

export default function ReservationPage() {
  return (
    <div className="container-shell space-y-8 py-16">
      <SectionHeading
        eyebrow="Prenotazioni"
        title="Calendario e fasce orarie protette da overbooking"
        description="Le richieste sono validate con Zod e controllate a livello transazionale per rispettare la capienza del ristorante."
      />
      <ReservationForm />
    </div>
  );
}
