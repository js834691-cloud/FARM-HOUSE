# ROOTS & SEASONS
### Complete Digital Farmhouse Journal, Living Gallery & Farm Management Platform

**Tagline:** Every Season Has a Story. Every Day Has Something Growing.

---

## 🌾 Overview
ROOTS & SEASONS documents and preserves the life of a family farmhouse across:
- **Fruits & Litchi Cultivation** (Shahi & Dehradun orchards)
- **Vegetable Gardening** (Brassicas, raised beds, companion marigolds)
- **Plants & Trees** (Desi mangoes, guavas, bamboo, herbs)
- **Animals & Birds** (Rescue dogs Sheru & Daisy, ducks, heritage turkeys, wild kingfishers)
- **Daily Farm Diary** (Full support for text-only updates & photographs)
- **Weekly Highlights & Seasonal Stories**
- **Living Photo Gallery & Historical Memory Archive** ("On This Day")
- **Protected Admin Management Dashboard** with Firebase Authentication

---

## 🎨 Design System
- **Aesthetic:** Neo-Brutalist + Nature-Inspired Editorial
- **Palette:**
  - Background: `#F4F0E6` (Warm paper)
  - Primary Green: `#183D2B`
  - Leaf Green: `#8BAF69`
  - Yellow: `#F5D547`
  - Orange: `#E97845`
  - Text & Lines: `#171717` (2.5px solid black borders, hard offset shadows)
- **Typography:** Archivo Black (Headings), DM Sans (Body), Space Mono (Labels & Meta)

---

## 🚀 Two Running Modes

### 1. Instant Zero-Dependency Browser Mode
Open `index.html` directly in any web browser, or launch with any local server:
```powershell
python -m http.server 8080
```
Then visit `http://localhost:8080`.
- All interactive modals, tabs, crop tracker, live statistics, and admin actions are **fully functional immediately**.
- Admin portal login credentials (demo):
  - **Email:** `admin@rootsandseasons.farm`
  - **Password:** `roots2026`

### 2. Next.js / Vercel Production Mode
Located in `/nextjs-app`:
```bash
cd nextjs-app
npm install
npm run dev
```
Deploy to Vercel with one click:
```bash
vercel
```
Set environment variables in `.env.local` or Vercel dashboard:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `BLOB_READ_WRITE_TOKEN` (Vercel Blob)

---

## 📊 6-Stage Implementation Roadmap
- [x] **Stage 1:** Inspect existing codebase & completely improve homepage (All 11 sections implemented, interactive 7 farm zones, plant growth stages, database statistics, "On This Day" historical archive).
- [x] **Stage 2:** Complete Living Gallery, Vercel Blob cloud storage interface & Farm Journal (daily text-only + photo entries, weekly summaries).
- [x] **Stage 3:** Build protected Admin Dashboard with Firebase Authentication & content creation tools.
- [x] **Stage 4:** Crop tracker with 6 developmental stages, harvest calendar & animal profiles.
- [x] **Stage 5:** Farm Zones explorer, chronological development timeline, weather observation diary & memory archive.
- [x] **Stage 6:** Mobile responsiveness, high-contrast Neo-Brutalist styling, backup export & Vercel deployment scaffolding.
