'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminLoginForm() {
  const router = useRouter();
  const [state, setState] = useState({ email: '', password: '' });
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    setMessage(null);
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setMessage(data.error ?? 'Accesso non riuscito');
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
      <h1 className="text-3xl font-semibold text-white">Admin login</h1>
      <div className="mt-6 space-y-4">
        <label className="block text-sm text-stone-200">
          Email
          <input
            type="email"
            className="mt-1 w-full rounded-2xl border border-white/10 bg-stone-950 px-4 py-3 text-white"
            value={state.email}
            onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))}
          />
        </label>
        <label className="block text-sm text-stone-200">
          Password
          <input
            type="password"
            className="mt-1 w-full rounded-2xl border border-white/10 bg-stone-950 px-4 py-3 text-white"
            value={state.password}
            onChange={(event) => setState((current) => ({ ...current, password: event.target.value }))}
          />
        </label>
        <button
          type="button"
          onClick={submit}
          className="w-full rounded-2xl bg-amber-300 px-4 py-3 font-semibold text-stone-950"
        >
          Accedi
        </button>
        {message ? <p className="text-sm text-red-300">{message}</p> : null}
      </div>
    </div>
  );
}
