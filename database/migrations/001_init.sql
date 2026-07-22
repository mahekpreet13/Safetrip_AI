CREATE TABLE IF NOT EXISTS crime (
    crime_id SERIAL PRIMARY KEY,
    crime_type VARCHAR(120) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    severity VARCHAR(30) NOT NULL,
    description VARCHAR(500),
    location_id INTEGER NOT NULL REFERENCES location(location_id)
);

CREATE TABLE IF NOT EXISTS police_station (
    station_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    location_id INTEGER NOT NULL REFERENCES location(location_id)
);

CREATE TABLE IF NOT EXISTS location (
    location_id SERIAL PRIMARY KEY,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address VARCHAR(255),
    city VARCHAR(120),
    state VARCHAR(120),
    country VARCHAR(120)
);
