# Sivasakthi's Mehandi – Portfolio & Booking Website

Next.js 14 (App Router) · TypeScript · Tailwind CSS · SQLite · signed-cookie admin login.
Ships with **252 of the artist's own photos** pre-sorted into the 8 categories (see "Photos").

## Quick start
```bash
npm install
cp .env.example .env.local     # then edit: ADMIN_PASSWORD, AUTH_SECRET, NEXT_PUBLIC_SITE_URL
npm run dev                     # http://localhost:3000
```
The database (`data/mehndi.db`) is created and seeded automatically on first run – no DB setup needed.
Admin: **/admin** (sign in with `ADMIN_PASSWORD`).

## ⚠ Before launch – confirm with the artist
| Item | Where | Current value |
|---|---|---|
| WhatsApp number (with country code, e.g. `919876543210`) | Admin → Settings | **placeholder** `910000000000` |
| Instagram username | Admin → Settings | `sivasakthis_mehandi` (taken from photo watermarks – **verify**) |
| Follower count | Admin → Settings | `15K+` (**to be confirmed**) |
| All prices | Admin → Designs / Packages | **sample placeholders** |
| Design names/descriptions, About text, hours | Admin | generic placeholders |
| Testimonials | Admin → Testimonials | none – section stays hidden until genuine reviews are added |

## How to update things (all in /admin – no code needed)
- **Designs**: *Designs* tab → *+ Add new* → choose category, price, upload photo → *Save*. Tick **Featured** to show on the homepage.
- **Prices**: edit *Price (₹)* and Save. `0` shows “Custom quote”. Tick **Starting price** for “From ₹…”. Same for *Packages*.
- **Categories**: rename, reorder, change cover photo/description.
- **Contact info, Instagram, locations, hours, About text**: *Settings* tab.
- **Enquiries**: set status, enter a **custom quote** + notes, press *Send quote on WhatsApp*. Enquiries and quotes are visible only to the logged-in admin.

## Photos
Photos are in `public/portfolio/` (`mNNN.webp` full size, `mNNN-sm.webp` thumbnail). Category assignment was a
first-pass guess from the images – please re-check in Admin → Designs. Near-duplicates were skipped.
New uploads are saved in `data/uploads/` and served via `/media/…`.

## Folder structure
```
app/              pages (home, designs, designs/[slug], about, contact, admin) + API routes
  api/enquiries   public enquiry endpoint (validated, honeypot)
  api/admin/*     protected CRUD, settings, image upload
components/       Header, Footer, DesignCard, DesignBrowser (filter+search), EnquiryForm, admin/*
lib/              db.ts (schema + seed), auth.ts, utils.ts (prices, WhatsApp links)
middleware.ts     blocks /admin and /api/admin without a valid session
seed/seed.json    initial categories, designs, packages, settings
```

## Deployment
SQLite and uploads are files, so use a host with a **persistent disk**:
- **VPS / Render / Railway / Fly.io** (recommended): `npm run build && npm start`; set env vars; mount a volume and set `DATA_DIR`.
- **Vercel / Netlify (serverless)**: disks aren't persistent – swap `lib/db.ts` for Turso/Postgres and the upload route for Cloudinary/S3.

**Back up `DATA_DIR`** (database + uploads) regularly.

## Security
Middleware-protected admin (signed httpOnly SameSite=strict cookie), rate-limited login, zod validation, upload type/size limits, secrets only in env vars. Use a strong `ADMIN_PASSWORD` and HTTPS.

## Not included
Instagram's official feed API (needs a Meta developer app) – the gallery uses approved portfolio photos plus a profile link. Also not included: auto-resizing of admin uploads, email/SMS alerts for new enquiries, multiple admin accounts.
