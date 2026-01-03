import * as SQLite from 'expo-sqlite';
import { City, Person, ContactMethod, Trip, Tier } from './models';

const db = SQLite.openDatabase('touchdown.db');

// Initialize the database and create tables if they don't exist
export function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // People table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS people (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT,
          primaryCityId TEXT,
          additionalCityIds TEXT,
          tier TEXT NOT NULL,
          notes TEXT,
          lastContactedAt TEXT,
          createdAt TEXT NOT NULL
        );`
      );

      // Cities table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS cities (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          state TEXT,
          country TEXT
        );`
      );

      // Contact methods table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS contact_methods (
          id TEXT PRIMARY KEY NOT NULL,
          personId TEXT NOT NULL,
          platform TEXT NOT NULL,
          value TEXT NOT NULL,
          deepLink TEXT NOT NULL
        );`
      );

      // Trips table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS trips (
          id TEXT PRIMARY KEY NOT NULL,
          cityId TEXT NOT NULL,
          startDate TEXT NOT NULL,
          endDate TEXT NOT NULL,
          source TEXT NOT NULL
        );`
      );
    }, reject, resolve);
  });
}

// Utility to map result set rows to array of objects
function mapRows<T>(resultSet: any): T[] {
  const rows: T[] = [];
  for (let i = 0; i < resultSet.rows.length; i++) {
    rows.push(resultSet.rows.item(i));
  }
  return rows;
}

// CRUD functions for People
export async function getPeople(): Promise<Person[]> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM people',
        [],
        (_, result) => {
          const mapped = mapRows<Person>(result);
          // Parse JSON fields
          const people = mapped.map(row => ({
            ...row,
            additionalCityIds: row.additionalCityIds ? JSON.parse(row.additionalCityIds) : []
          }));
          resolve(people);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function getPerson(id: string): Promise<Person | undefined> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM people WHERE id = ?',
        [id],
        (_, result) => {
          if (result.rows.length > 0) {
            const row = result.rows.item(0);
            const person: Person = {
              ...row,
              additionalCityIds: row.additionalCityIds ? JSON.parse(row.additionalCityIds) : [],
            };
            resolve(person);
          } else {
            resolve(undefined);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function insertPerson(person: Person): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO people (id, name, primaryCityId, additionalCityIds, tier, notes, lastContactedAt, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          person.id,
          person.name,
          person.primaryCityId,
          JSON.stringify(person.additionalCityIds || []),
          person.tier,
          person.notes,
          person.lastContactedAt,
          person.createdAt,
        ],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function updatePerson(person: Person): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE people SET name = ?, primaryCityId = ?, additionalCityIds = ?, tier = ?, notes = ?, lastContactedAt = ? WHERE id = ?`,
        [
          person.name,
          person.primaryCityId,
          JSON.stringify(person.additionalCityIds || []),
          person.tier,
          person.notes,
          person.lastContactedAt,
          person.id,
        ],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function deletePerson(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM contact_methods WHERE personId = ?', [id]);
      tx.executeSql('DELETE FROM people WHERE id = ?', [id], () => resolve(), (_, error) => {
        reject(error);
        return false;
      });
    });
  });
}

// CRUD for Cities
export async function getCities(): Promise<City[]> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM cities',
        [],
        (_, result) => resolve(mapRows<City>(result)),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function getCity(id: string): Promise<City | undefined> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM cities WHERE id = ?',
        [id],
        (_, result) => {
          if (result.rows.length > 0) {
            resolve(result.rows.item(0) as City);
          } else {
            resolve(undefined);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function insertCity(city: City): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO cities (id, name, state, country) VALUES (?, ?, ?, ?)`,
        [city.id, city.name, city.state || null, city.country || null],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function updateCity(city: City): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE cities SET name = ?, state = ?, country = ? WHERE id = ?`,
        [city.name, city.state || null, city.country || null, city.id],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function deleteCity(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // For now, do not automatically delete people; we keep persons referencing this city; they will appear in Inbox.
      tx.executeSql('DELETE FROM cities WHERE id = ?', [id], () => resolve(), (_, error) => {
        reject(error);
        return false;
      });
    });
  });
}

// CRUD for Contact Methods
export async function getContactMethodsForPerson(personId: string): Promise<ContactMethod[]> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM contact_methods WHERE personId = ?',
        [personId],
        (_, result) => resolve(mapRows<ContactMethod>(result)),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function insertContactMethod(method: ContactMethod): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO contact_methods (id, personId, platform, value, deepLink) VALUES (?, ?, ?, ?, ?)`,
        [method.id, method.personId, method.platform, method.value, method.deepLink],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function updateContactMethod(method: ContactMethod): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE contact_methods SET platform = ?, value = ?, deepLink = ? WHERE id = ?`,
        [method.platform, method.value, method.deepLink, method.id],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function deleteContactMethod(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM contact_methods WHERE id = ?', [id], () => resolve(), (_, error) => {
        reject(error);
        return false;
      });
    });
  });
}

// CRUD for Trips
export async function getTrips(): Promise<Trip[]> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM trips',
        [],
        (_, result) => resolve(mapRows<Trip>(result)),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function insertTrip(trip: Trip): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO trips (id, cityId, startDate, endDate, source) VALUES (?, ?, ?, ?, ?)`,
        [trip.id, trip.cityId, trip.startDate, trip.endDate, trip.source],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function updateTrip(trip: Trip): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE trips SET cityId = ?, startDate = ?, endDate = ?, source = ? WHERE id = ?`,
        [trip.cityId, trip.startDate, trip.endDate, trip.source, trip.id],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function deleteTrip(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM trips WHERE id = ?', [id], () => resolve(), (_, error) => {
        reject(error);
        return false;
      });
    });
  });
}