🌍 Country Explorer

This is a Next.js
 + MongoDB
 project bootstrapped with create-next-app
.

It allows users to explore countries, search with filters, and view detailed information — all powered by data seeded from the REST Countries API
.

Getting Started
1. Install dependencies
npm install

2. Start MongoDB with Docker
docker-compose up -d

3. Seed the database
npm run seed:mongo

4. Run the development server
npm run dev
# or
yarn dev
# or
pnpm dev


Open http://localhost:3000
 in your browser to see the app.

Features

Home Page

Full-screen background with overlay

Search bar with continent filter and debounced fuzzy search

Infinite scroll in suggestions

Search Results Page

Compact search bar reused

Grid of country cards with flag, name, capital, region, currency, population

Sortable by Name, Capital, or Currency

Paginated results

Filters preserved in URL query params

Country Details Page

Dedicated country detail view

Flag banner, Name, Official Name, Capital, Region, Subregion, Population, Currencies

Languages, Timezones, and Border countries

Back button returns to Search with previous filters

Environment Variables

Create a .env.local file in your project root:

MONGO_URI=mongodb://localhost:27017/country_explorer
USE_DB=true
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RESTCOUNTRIES_FIELDS=name,cca3,flags,capital,region,subregion,currencies,population,area,languages,timezones,borders,latlng

Reseeding Data

To reseed the database with fresh data:

# Open a Mongo shell
docker exec -it country_mongo mongosh

# Use the DB
use country_explorer

# Drop the old collection
db.countries.drop()

# Exit
exit

# Reseed
npm run seed:mongo

Learn More

To learn more about the tools used in this project:

Next.js Documentation
 – features, API, and guides.

MongoDB Documentation
 – database engine details.

TailwindCSS Documentation
 – styling utilities.

REST Countries API
 – the

You said:
like you are giving 🌍 Country Explorer
but sholdnt it be #Country explorer so that it know its heading
ChatGPT said:

Exactly 👍 You’re right — GitHub READMEs use Markdown headings (#) for section titles.
The emojis 🌍 etc. are optional flair, but the important part is the # / ## syntax so GitHub recognizes them as headings.

Here’s your README rewritten formally with Markdown headings:

Country Explorer

This is a Next.js
 + MongoDB
 project bootstrapped with create-next-app
.

It allows users to explore countries, search with filters, and view detailed information — all powered by data seeded from the REST Countries API
.

Getting Started
1. Install dependencies
npm install

2. Start MongoDB with Docker
docker-compose up -d

3. Seed the database
npm run seed:mongo

4. Run the development server
npm run dev
# or
yarn dev
# or
pnpm dev


Open http://localhost:3000
 in your browser to see the app.

Features
Home Page

Full-screen background with overlay

Search bar with continent filter and debounced fuzzy search

Infinite scroll in suggestions

Search Results Page

Compact search bar reused

Grid of country cards with flag, name, capital, region, currency, population

Sortable by Name, Capital, or Currency

Paginated results

Filters preserved in URL query params

Country Details Page

Dedicated country detail view

Flag banner, Name, Official Name, Capital, Region, Subregion, Population, Currencies

Languages, Timezones, and Border countries

Back button returns to Search with previous filters

Environment Variables

Create a .env.local file in your project root:

MONGO_URI=mongodb://localhost:27017/country_explorer
USE_DB=true
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RESTCOUNTRIES_FIELDS=name,cca3,flags,capital,region,subregion,currencies,population,area,languages,timezones,borders,latlng

Reseeding Data

To reseed the database with fresh data:

# Open a Mongo shell
docker exec -it country_mongo mongosh

# Use the DB
use country_explorer

# Drop the old collection
db.countries.drop()

# Exit
exit

# Reseed
npm run seed:mongo

Learn More

Next.js Documentation

MongoDB Documentation

TailwindCSS Documentation

REST Countries API