"""Import sample crime records from a CSV file into PostgreSQL."""

from __future__ import annotations

import csv
import os
from datetime import datetime

import psycopg2


def get_connection():
    database_url = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/safetrip_ai",
    )
    return psycopg2.connect(database_url)


def import_locations(csv_path: str) -> None:
    with get_connection() as connection:
        with connection.cursor() as cursor:
            with open(csv_path, newline="", encoding="utf-8") as file:
                reader = csv.DictReader(file)
                for row in reader:
                    cursor.execute(
                        """
                        INSERT INTO location (
                            location_id, latitude, longitude, address, city, state, country
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (location_id) DO NOTHING
                        """,
                        (
                            int(row["location_id"]),
                            float(row["latitude"]),
                            float(row["longitude"]),
                            row["address"],
                            row["city"],
                            row["state"],
                            row["country"],
                        ),
                    )
        connection.commit()


def import_crimes(csv_path: str) -> None:
    with get_connection() as connection:
        with connection.cursor() as cursor:
            with open(csv_path, newline="", encoding="utf-8") as file:
                reader = csv.DictReader(file)
                for row in reader:
                    cursor.execute(
                        """
                        INSERT INTO crime (
                            crime_id, crime_type, date, time, severity, description, location_id
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (crime_id) DO NOTHING
                        """,
                        (
                            int(row["crime_id"]),
                            row["crime_type"],
                            datetime.strptime(row["date"], "%Y-%m-%d").date(),
                            datetime.strptime(row["time"], "%H:%M:%S").time(),
                            row["severity"],
                            row["description"],
                            int(row["location_id"]),
                        ),
                    )
        connection.commit()


if __name__ == "__main__":
    import_locations("data/sample_locations.csv")
    import_crimes("data/sample_crime.csv")
