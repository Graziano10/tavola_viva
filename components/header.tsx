import Link from 'next/link';

const links = [
  { href: '/menu', label: 'Menu' },
  { href: '/order', label: 'Ordina' },
  { href: '/reservation', label: 'Prenota' },
  { href: '/admin', label: 'Admin' },
];

export function Header() {
  return (
    <header className="border-b border-white/10 bg-stone-950/80 backdrop-blur">
      <div className="container-shell flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-[0.2em] text-amber-300 uppercase">
          Tavola Viva
        </Link>
        <nav className="flex items-center gap-5 text-sm text-stone-300">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
