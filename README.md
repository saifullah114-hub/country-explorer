# 🌍 Country Explorer

A full-stack Country Explorer built with **Next.js** (App Router), **MongoDB**, and **TailwindCSS**.
Fetches data from the [REST Countries API](https://restcountries.com/), seeds and stores it in a local MongoDB (Docker), and exposes fast, fuzzy, paginated searches and detailed country views.

## ✨ Features

### 🏠 Home
- Full-screen background with overlay
- Centered search bar with continent filter
- Debounced, fuzzy autocomplete suggestions (Fuse.js)
- Infinite scroll in suggestions

### 🔍 Search Results
- Compact search bar
- Grid of country cards (flag, name, capital, region, currency, population)
- Sortable by name / capital / currency
- Pagination
- Filters and sort preserved in URL query params

### 📄 Country Details
- Dedicated page with flag banner
- Official name, capital, region, subregion, population, currencies, languages, timezones, borders
- Back button returns to search with previous filters preserved

### 🗄️ Data Layer
- Local MongoDB seed from REST Countries
- `USE_DB` toggle to switch between local DB and remote REST API
- Centralized `lib/dataService.ts` abstraction (DB/API switching, normalization)

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **Docker & Docker Compose** (for local MongoDB)

### 1. Clone
```bash
git clone https://github.com/<your-username>/country-explorer.git
cd country-explorer
```

### 2. Install
```bash
npm install
```

### 3. Start MongoDB (Docker)
```bash
docker-compose up -d
```

### 4. Environment
Create `.env.local` in the project root (do not commit this file):

```env
MONGO_URI=mongodb://localhost:27017/country_explorer
USE_DB=true
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RESTCOUNTRIES_FIELDS=name,cca3,flags,capital,region,subregion,currencies,population,area,languages,timezones,borders,latlng
```

- `USE_DB=true` → use local MongoDB (recommended for speed)
- `USE_DB=false` → fallback to REST Countries API (no local DB required)

### 5. Seed the database
```bash
npm run seed:mongo
```

### 6. Run dev server
```bash
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

## 🔄 Reseeding / Reset DB

To drop and reseed:

```bash
# Drop countries collection (via Docker container)
docker exec -it country_mongo mongosh --eval "use country_explorer; db.countries.drop();"

# Reseed
npm run seed:mongo
```

> **Note:** There is a `seed_logs` collection created by the seeder to track success/failure of each run.

## ⚙️ Environment Variables

Add a `.env.example` (placeholders only) to repo so others know required vars:

```env
MONGO_URI=mongodb://localhost:27017/country_explorer
USE_DB=true
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RESTCOUNTRIES_FIELDS=name,cca3,flags,capital,region,subregion,currencies,population,area,languages,timezones,borders,latlng
```

> **Important:** Add `.env*` files to `.gitignore` (see below).

## 🏗️ Architecture Decisions

- **Next.js (App Router)**: single framework for UI and API routes; server components where appropriate
- **MongoDB + Mongoose**: flexible schema for REST Countries nested data; fast local queries
- **Fuse.js**: fuzzy search to tolerate minor typos in user input
- **Data abstraction**: `lib/dataService.ts` centralizes data access and normalization; switching source is a single flag (`USE_DB`)
- **UI/UX**: skeleton loaders and a `FlagImage` component for graceful image loading/fallback. Debounced inputs and infinite scroll avoid excessive network calls
- **Error handling**: API routes return consistent `{ data, meta }` or `{ error }` shapes; seed script logs results to `seed_logs`

## 📋 Assumptions

- Primary key for countries is `cca3`. If `_id` exists (DB mode), it is used internally; UI relies on a stable `id` (falls back to `cca3`)
- `capital` may be an array in source data — UI shows the first value
- `currencies_list` (array of currency names) is created during seeding for easier display; fallbacks exist if missing
- If the local DB is not present (or `USE_DB=false`), app functionality remains available using live REST API (slower)

## 📁 Project Structure (important files)

```
.
├── app/
│   ├── api/
│   │   └── countries/
│   │       ├── route.ts                # GET paginated countries → calls dataService
│   │       ├── suggestions/route.ts    # GET suggestions → calls dataService
│   │       └── [cca3]/route.ts         # GET country by cca3 → calls dataService
│   ├── country/[cca3]/page.tsx         # Country details page (server component)
│   ├── search/page.tsx                 # Search results (client component)
│   └── page.tsx                        # Home / hero page
├── components/
│   ├── SearchBar.tsx
│   ├── CountryCard.tsx
│   ├── FlagImage.tsx
├── lib/
│   ├── mongo.ts                        # connectMongo()
│   └── dataService.ts                  # getCountries, getCountryByCode, getSuggestions
├── models/
│   ├── Country.ts                      # Mongoose schema
├── scripts/
│   └── seed-mongo.ts                   # Seeder (creates countries + seed_logs)
├── package.json
└── README.md
```

## 📜 NPM Scripts

```json
{
  "scripts": {
   "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "seed:mongo": "ts-node scripts/seed-mango.ts"
  }
}
```

## 📝 .gitignore (suggested)

```gitignore
# dependencies
/node_modules

# builds
/.next
/out
/.turbo

# env
.env
.env.local

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
```

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Search**: Fuse.js (fuzzy search)
- **Data Source**: REST Countries API
- **Containerization**: Docker & Docker Compose

---
