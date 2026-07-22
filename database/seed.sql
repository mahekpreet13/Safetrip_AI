INSERT INTO location (location_id, latitude, longitude, address, city, state, country) VALUES
    (1, 28.6139, 77.2090, 'New Delhi', 'New Delhi', 'Delhi', 'India'),
    (2, 19.0760, 72.8777, 'Mumbai', 'Mumbai', 'Maharashtra', 'India'),
    (3, 12.9716, 77.5946, 'Bengaluru', 'Bengaluru', 'Karnataka', 'India')
ON CONFLICT (location_id) DO NOTHING;

INSERT INTO crime (crime_id, crime_type, date, time, severity, description, location_id) VALUES
    (1, 'Theft', '2026-07-01', '18:30:00', 'Medium', 'Reported theft near a transit area.', 1),
    (2, 'Assault', '2026-07-02', '22:10:00', 'High', 'Late-night assault incident.', 2),
    (3, 'Robbery', '2026-07-03', '20:45:00', 'High', 'Robbery reported near a commercial road.', 3),
    (4, 'Pickpocketing', '2026-07-04', '14:15:00', 'Low', 'Minor pickpocketing incident.', 2),
    (5, 'Vandalism', '2026-07-05', '23:05:00', 'Medium', 'Property vandalism reported.', 1)
ON CONFLICT (crime_id) DO NOTHING;

INSERT INTO police_station (station_id, name, phone, email, location_id) VALUES
    (1, 'Central Police', '+91-1111111111', 'central.police@example.com', 3),
    (2, 'South Police', '+91-2222222222', 'south.police@example.com', 2)
ON CONFLICT (station_id) DO NOTHING;
