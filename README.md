# Eman HR OS

Unified Saudi Workforce OS for **Eman Bakery / Marsana**, built with Next.js, Tailwind, minimal 3D dashboard (React Three Fiber), Supabase, and local Puppeteer bots for Muqeem, Qiwa, GOSI, and Mudad.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your Supabase values.

3. Create a `profiles` table in Supabase:

```sql
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  iqama text,
  iqama_expiry date,
  contract_expiry date,
  wps_status text check (wps_status in ('red','yellow','green')),
  status text check (status in ('critical','warning','healthy')) default 'healthy'
);
```

4. Run the dev server:

```bash
npm run dev
```

5. Open `http://localhost:3000` to view the 3D traffic-light dashboard.

The next steps will be to add the local `server_bot.js` Puppeteer robot and hook the "One-Click Sync" button to trigger Muqeem/Qiwa/GOSI/Mudad scrapers on `http://localhost:3000`.
