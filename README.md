# GRIND Company Profile + CMS (Next.js App Router)

Aplikasi fullstack company profile dan CMS untuk PT GELORA ENERGI INDONESIA (GRIND).

## Stack

- Next.js App Router (tanpa Express)
- Next.js Route Handlers + Server Actions
- MySQL + Prisma ORM
- NextAuth.js Credentials Provider
- Tailwind CSS + Framer Motion

## Fitur Utama

- Public website: Hero, About, Services, Staff, Event Portfolio, Galeri Perusahaan, Contact
- CMS `/admin`: login admin + CRUD Site Settings, Staff, Services, Events, Event Galleries, Galeri Perusahaan, Users
- Tema dark dengan aksen merah dan cyan sesuai PRD
- Struktur galeri/staff memakai crop `object-cover` + zoom proporsional (`scale-110`) dan teks diletakkan di luar area subjek gambar

## Setup Lokal

1. Install dependency:

```bash
npm install
```

2. Buat file `.env` dari contoh:

```bash
cp .env.example .env
```

3. Jalankan Prisma:

```bash
npx prisma migrate dev --name init
npx prisma generate
npm run seed
```

4. Jalankan app:

```bash
npm run dev
```

Akses:

- Public: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`
- Default admin: `admin` / `P@ssw0rd`

## Environment Variables

```env
DATABASE_URL="mysql://root:root@localhost:3306/grind_db"
NEXTAUTH_SECRET="isi-random-string-panjang"
NEXTAUTH_URL="http://localhost:3000"
```

## Deploy dengan Docker Compose (VPS)

1. Ubah nilai secret pada `docker-compose.yml`.
2. Jalankan:

```bash
docker compose up -d --build
```

3. Migrasi + seed (sekali):

```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run seed
```

## Deploy dengan PM2 (tanpa Docker)

1. Copy project ke VPS, set `.env`, install dependency:

```bash
npm install
npx prisma migrate deploy
npm run build
```

2. Jalankan PM2:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Struktur Endpoint API (Route Handlers)

- `GET/PUT /api/site-settings`
- `GET/POST /api/staff`, `GET/PUT/DELETE /api/staff/:id`
- `GET/POST /api/services`, `GET/PUT/DELETE /api/services/:id`
- `GET/POST /api/events`, `GET/PUT/DELETE /api/events/:id`
- `GET/POST /api/events/:id/galleries`
- `PUT/DELETE /api/event-galleries/:id`
- `GET/POST /api/global-galleries`, `PUT/DELETE /api/global-galleries/:id`
- `GET/POST /api/users`, `PUT/DELETE /api/users/:id`
