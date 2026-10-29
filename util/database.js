import * as SQLite from 'expo-sqlite';
import { Place } from '../models/place';

let database;

export async function init() {
  database = await SQLite.openDatabaseAsync('places.db');
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      imageUri TEXT NOT NULL,
      address TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL
    );
  `);
}

export async function insertPlace(place) {
  if (!database) {
    database = await SQLite.openDatabaseAsync('places.db');
  }
  const result = await database.runAsync(
    'INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)',
    [
      place.title,
      place.imageUri,
      place.address,
      place.location.lat,
      place.location.lng,
    ]
  );
  return result.lastInsertRowId;
}

export async function fetchPlaces() {
  if (!database) {
    database = await SQLite.openDatabaseAsync('places.db');
  }
  const rows = await database.getAllAsync('SELECT * FROM places');
  return rows.map(
    (dp) =>
      new Place(
        dp.title,
        dp.imageUri,
        {
          address: dp.address,
          lat: dp.lat,
          lng: dp.lng,
        },
        dp.id
      )
  );
}

export async function fetchPlaceDetails(id) {
  if (!database) {
    database = await SQLite.openDatabaseAsync('places.db');
  }
  const dbPlace = await database.getFirstAsync(
    'SELECT * FROM places WHERE id = ?',
    [id]
  );
  if (!dbPlace) {
    return null;
  }
  return new Place(
    dbPlace.title,
    dbPlace.imageUri,
    {
      address: dbPlace.address,
      lat: dbPlace.lat,
      lng: dbPlace.lng,
    },
    dbPlace.id
  );
}

export async function deletePlace(id) {
  if (!database) {
    database = await SQLite.openDatabaseAsync('places.db');
  }
  const result = await database.runAsync('DELETE FROM places WHERE id = ?', [id]);
  return result;
}
