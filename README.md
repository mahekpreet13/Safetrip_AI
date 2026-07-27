# SafeTrip AI

SafeTrip AI is an AI-powered travel planner that helps users create personalized itineraries while considering safety, weather, and route risk.

## Project Idea

The platform combines:

- AI-generated travel itineraries
- Interactive crime heatmaps
- Safety scores for neighborhoods and places
- Safer route recommendations
- Weather-aware trip planning
- Nearby emergency services and police locations
- Emergency mode with SOS and live location sharing
- Crime trend analytics and safety insights
- AI travel assistant for safety-related questions

## Tech Stack

- Frontend: React, Tailwind CSS, Leaflet.js, Chart.js
- Backend: FastAPI
- Database: PostgreSQL + PostGIS
- AI: Ollama with Llama 3 or Mistral, or OpenAI/Gemini for demo use

## Data Sources

- OpenStreetMap
- OpenRouteService
- Open-Meteo API
- Public crime datasets
- Overpass API

## Folder Structure

- `frontend/` for the React app
- `backend/` for the FastAPI app
- `database/` for database notes and migrations
- `data/` for datasets and imports
- `docs/` for project documentation
- `config/` for environment and app configuration
- `scripts/` for utility scripts

## Current Skeleton

This repository currently contains an empty folder structure with only this main `README.md`.

## Today’s Tasks

### Task 1: Project Setup

- Create FastAPI project
- Set up folder structure
- Add environment configuration
- Connect PostgreSQL
- Prepare PostGIS support for later
- Test API endpoint

Deliverable:

- `GET /` returns `API Running`

### Task 2: Database Design

Create tables:

- `Crime`
- `PoliceStation`
- `Location`

Sample crime fields:

- `crime_id`
- `crime_type`
- `latitude`
- `longitude`
- `date`
- `time`
- `severity`

Deliverable:

- Database populated with sample crime data
- Sample CSV located at `data/sample_crime.csv`
- SQL seed file located at `database/seed.sql`


## Completed: Task 3 & Task 4

### Task 3: Search API

Endpoints:
- `GET /search?query={location}` — geocodes a location using OpenStreetMap Nominatim (real, live coordinates), matches it against our database, and returns nearby crimes with a computed risk score.
- `GET /location?city={city}` — looks up a city directly in our database (no external API call), returns the same shape: coordinates, nearby crimes, risk score.

New files added:
- `backend/app/services/geocoding.py` — calls OpenStreetMap Nominatim for real geocoding
- `backend/app/services/location_matching.py` — matches city names against the database, handling naming variations (e.g. "Delhi" vs "New Delhi")
- `backend/app/services/risk_engine.py` — shared risk score calculation, used by both Task 3 and Task 4
- `backend/app/schemas/search.py` — response schema for search/location endpoints
- `backend/app/routes/search.py` — the two endpoints above

### Task 4: Crime Analytics

Endpoints:
- `GET /crime-summary?city={city}` — returns crime count, most common crime type, peak hour, and risk score for a city.
- `GET /crime-trends?city={city}` — returns crime counts broken down by month, day of week, hour, and category — formatted for direct use with Chart.js on the frontend.

New files added:
- `backend/app/schemas/crime.py` — response schemas for the two endpoints above
- `backend/app/routes/crime.py` — the two endpoints above

### Data note

- Delhi, Mumbai, and Bengaluru currently use the original sample data from `seed.sql` (5 records total) — this is placeholder/demo data, not official crime statistics. Every API response includes a `"data_source"` field so this is always clear.
- Chicago was added as a 4th city using **real, live crime data** pulled directly from the City of Chicago's public open data portal (Chicago Police Department's own reporting system). See `scripts/import_chicago_crime.py`. This exists to prove the risk-scoring, trends, and heatmap logic works correctly on a large, real dataset (500 records), since India doesn't have a public dataset with point-level crime coordinates. Run this script if you want to add/refresh the real Chicago data locally.
- Plan: sample data for Delhi/Mumbai/Bengaluru will be expanded later (more realistic dummy records) to better support demo/testing.

### Known fix applied

`database/schema.sql` originally created the `crime` and `police_station` tables before `location`, but both have foreign keys pointing to `location` — this caused a table-creation failure. Fixed by reordering `location` to be created first. Make sure you're using the latest version of `schema.sql` before setting up your local database.

---

## How to Run the Backend Locally

### 1. Prerequisites
- Python 3.11+ installed
- PostgreSQL installed and running (v16 or v17 recommended)

### 2. Clone and set up the virtual environment
```powershell
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
```

### 3. Set up the database
Create the database (only needed once):
```powershell
psql -U postgres
```
```sql
CREATE DATABASE safetrip_ai;
\q
```

Load the schema and seed data:
```powershell
cd ..                        # move to project root, where database/ lives
psql -U postgres -d safetrip_ai -f database\schema.sql
psql -U postgres -d safetrip_ai -f database\seed.sql
```

### 4. Configure environment variables
```powershell
cd backend
copy .env.example .env
```
Open `.env` and set your local Postgres password:
⚠️ If your password contains special characters like `@`, either change it to something alphanumeric, or URL-encode it (e.g. `@` → `%40`).

Also set a real contact email (used when calling the OpenStreetMap Nominatim API, per their usage policy):


### 5. Run the server
```powershell
uvicorn app.main:app --reload
```
Visit:
- `http://127.0.0.1:8000/` → should show `{"message": "API Running"}`
- `http://127.0.0.1:8000/db` → confirms database connection
- `http://127.0.0.1:8000/docs` → interactive API docs (test any endpoint directly from the browser)

### 6. (Optional) Import real Chicago crime data
```powershell
cd ..                        # project root
python scripts\import_chicago_crime.py
```
This pulls ~500 real crime records from Chicago's public data portal — no API key needed.

### Quick endpoint reference

| Endpoint | Example |
|---|---|
| `GET /search?query=` | `/search?query=Delhi` |
| `GET /location?city=` | `/location?city=Mumbai` |
| `GET /crime-summary?city=` | `/crime-summary?city=Bengaluru` |
| `GET /crime-trends?city=` | `/crime-trends?city=Chicago` |
