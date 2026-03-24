'use client';

import { useState } from 'react';

export function ReservationForm() {
  const [state, setState] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    partySize: '2',
    reservationAt: '',
    notes: '',
  });
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    setMessage(null);
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...state,
        notes: state.notes || null,
      }),
    });

    const data = (await response.json()) as { error?: string; success?: boolean };
    setMessage(data.error ?? 'Prenotazione ricevuta correttamente.');
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ['customerName', 'Nome e cognome', 'text'],
          ['customerEmail', 'Email', 'email'],
          ['customerPhone', 'Telefono', 'tel'],
          ['partySize', 'Coperti', 'number'],
          ['reservationAt', 'Data e ora', 'datetime-local'],
        ].map(([field, label, type]) => (
          <label key={field} className="block text-sm text-stone-200">
            {label}
            <input
              type={type}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-stone-950 px-4 py-3 text-white outline-none"
              value={state[field as keyof typeof state]}
              onChange={(event) => setState((current) => ({ ...current, [field]: event.target.value }))}
            />
          </label>
        ))}
      </div>
      <label className="mt-4 block text-sm text-stone-200">
        Note
        <textarea
          className="mt-1 min-h-24 w-full rounded-2xl border border-white/10 bg-stone-950 px-4 py-3 text-white outline-none"
          value={state.notes}
          onChange={(event) => setState((current) => ({ ...current, notes: event.target.value }))}
        />
      </label>
      <button
        type="button"
        onClick={submit}
        className="mt-4 rounded-2xl bg-amber-300 px-5 py-3 font-semibold text-stone-950"
      >
        Prenota tavolo
      </button>
      {message ? <p className="mt-3 text-sm text-stone-300">{message}</p> : null}
    </div>
  );
}
