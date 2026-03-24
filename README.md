# Tavola Viva

Applicazione web production-ready per ristorante costruita con **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **PostgreSQL** e **Docker Compose**.

## Architettura

```text
app/
  admin/           dashboard protetta, CRUD operativo e overview
  api/             route handlers con validazione, rate limit e auth
  menu/            listing SSR + slug SEO-friendly
  order/           checkout e carrello persistente
  reservation/     form prenotazioni con anti-overbooking
components/        UI modulari e client components isolate
lib/
  auth.ts          sessione admin con cookie httpOnly e JWT firmato
  prisma.ts        singleton Prisma Client
  validators.ts    contratti Zod lato server
  api.ts           wrappers per error handling e rate limiting
  sanitize.ts      sanitizzazione input user-generated
prisma/
  schema.prisma    dominio dati, relazioni, indici, enum
  seed.ts          dataset iniziale per menu/demo
docker-compose.yml stack applicativo completo
Dockerfile         immagine multi-stage ottimizzata per produzione
```

## API principali

- `GET/POST /api/menu/categories` — catalogo categorie e CRUD admin.
- `GET/POST /api/menu/items` — lettura prodotti e creazione item/varianti.
- `GET/POST/PATCH /api/orders` — checkout e aggiornamento stato ordine.
- `GET/POST /api/reservations` — agenda prenotazioni con anti-overbooking.
- `POST /api/admin/login` / `POST /api/admin/logout` — sessioni admin protette.

## Sicurezza e produzione

- Validazione **Zod** su ogni payload mutabile.
- Cookie `httpOnly` firmato con **jose** per autenticazione admin.
- **Rate limiting** base per IP su route sensibili.
- Sanitizzazione testo/slug per contenuti user-provided.
- Security headers via `middleware.ts`.
- Build Docker **multi-stage** con base `node:alpine`.
- PostgreSQL persistente via volume dedicato.

## Avvio locale

1. Copia `.env.example` in `.env` e personalizza i segreti.
2. Installa le dipendenze:

   ```bash
   npm install
   ```

3. Genera Prisma Client e popola il database:

   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. Avvia il progetto:

   ```bash
   npm run dev
   ```

## Docker Compose

```bash
docker compose up --build
```

Per Prisma Studio:

```bash
docker compose --profile tools up prisma-studio
```

## Best practices consigliate

- Usare un reverse proxy (Nginx/Traefik) con TLS termination in produzione.
- Spostare il rate limit su Redis/Upstash in deployment multi-instance.
- Abilitare audit logging e observability (OpenTelemetry/Sentry) per ambienti enterprise.
- Integrare pagamenti e webhooks separando bounded contexts `orders`, `catalog`, `reservations` se il traffico cresce.
