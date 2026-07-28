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


for database:
Step 1: Open PostgreSQL
psql -d safetrip_ai
Step 2: List all tables
\dt

Expected:

crime
location
Step 3: Check data in Location table
SELECT * FROM location;
Step 4: Check data in Crime table
SELECT * FROM crime;
Step 5: Count records
SELECT COUNT(*) FROM location;
SELECT COUNT(*) FROM crime;
Step 6: Check table structure
\d location
\d crime
Step 7: Exit PostgreSQL
\q


for backend:python -m uvicorn app.main:app --reload