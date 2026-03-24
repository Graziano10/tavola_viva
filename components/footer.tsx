export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 text-sm text-stone-400">
      <div className="container-shell flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Tavola Viva. Esperienza digitale per il ristorante.</p>
        <p>Next.js App Router · Prisma · PostgreSQL · Docker</p>
      </div>
    </footer>
  );
}
