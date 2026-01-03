import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Person, City, ContactMethod, Trip, Tier } from '../data/models';
import * as db from '../data/database';
import { v4 as uuidv4 } from 'uuid';
import { buildDeepLink } from '../utils/linking';

interface DataContextProps {
  people: Person[];
  cities: City[];
  contactMethods: ContactMethod[];
  trips: Trip[];
  loading: boolean;
  // Derived helpers
  getPeopleByCity: (cityId: string) => Person[];
  getContactMethodsForPerson: (personId: string) => ContactMethod[];
  // CRUD operations
  addPerson: (partial: Partial<Omit<Person, 'id' | 'createdAt'>>) => Promise<string>;
  updatePerson: (person: Person) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;
  addCity: (name: string, state?: string | null, country?: string | null) => Promise<string>;
  updateCity: (city: City) => Promise<void>;
  deleteCity: (id: string) => Promise<void>;
  addContactMethod: (personId: string, platform: ContactMethod['platform'], value: string) => Promise<string>;
  updateContactMethod: (method: ContactMethod) => Promise<void>;
  deleteContactMethod: (id: string) => Promise<void>;
  addTrip: (cityId: string, startDate: string, endDate: string, source?: 'MANUAL') => Promise<string>;
  updateTrip: (trip: Trip) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [people, setPeople] = useState<Person[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    async function init() {
      await db.initializeDatabase();
      await loadAll();
      setLoading(false);
    }
    init();
  }, []);

  async function loadAll() {
    const [peopleRes, citiesRes, tripsRes] = await Promise.all([
      db.getPeople(),
      db.getCities(),
      db.getTrips(),
    ]);
    // For contact methods, we need to load all per person and merge them.
    // We'll load contact methods for all people.
    const allContactMethods: ContactMethod[] = [];
    for (const person of peopleRes) {
      const methods = await db.getContactMethodsForPerson(person.id);
      allContactMethods.push(...methods);
    }
    setPeople(peopleRes);
    setCities(citiesRes);
    setTrips(tripsRes);
    setContactMethods(allContactMethods);
  }

  // Helper functions
  const getPeopleByCity = (cityId: string): Person[] => {
    return people.filter(p => p.primaryCityId === cityId || p.additionalCityIds.includes(cityId));
  };

  const getContactMethodsForPerson = (personId: string): ContactMethod[] => {
    return contactMethods.filter(cm => cm.personId === personId);
  };

  // CRUD operations
  async function addPerson(partial: Partial<Omit<Person, 'id' | 'createdAt'>>): Promise<string> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newPerson: Person = {
      id,
      name: partial.name ?? null,
      primaryCityId: partial.primaryCityId ?? null,
      additionalCityIds: partial.additionalCityIds ?? [],
      tier: (partial.tier ?? 'GREEN') as Tier,
      notes: partial.notes ?? null,
      lastContactedAt: partial.lastContactedAt ?? null,
      createdAt: now,
    };
    await db.insertPerson(newPerson);
    setPeople(prev => [...prev, newPerson]);
    return id;
  }

  async function updatePersonRecord(person: Person): Promise<void> {
    await db.updatePerson(person);
    setPeople(prev => prev.map(p => (p.id === person.id ? person : p)));
  }

  async function deletePersonRecord(id: string): Promise<void> {
    await db.deletePerson(id);
    setPeople(prev => prev.filter(p => p.id !== id));
    // Remove related contact methods
    setContactMethods(prev => prev.filter(cm => cm.personId !== id));
  }

  async function addCityRecord(name: string, state?: string | null, country?: string | null): Promise<string> {
    const id = uuidv4();
    const city: City = { id, name, state: state ?? null, country: country ?? null };
    await db.insertCity(city);
    setCities(prev => [...prev, city]);
    return id;
  }

  async function updateCityRecord(city: City): Promise<void> {
    await db.updateCity(city);
    setCities(prev => prev.map(c => (c.id === city.id ? city : c)));
  }

  async function deleteCityRecord(id: string): Promise<void> {
    await db.deleteCity(id);
    setCities(prev => prev.filter(c => c.id !== id));
    // Also update people referencing this city: they will be flagged for Inbox (missing city)
    setPeople(prev => prev.map(p => {
      const primary = p.primaryCityId === id ? null : p.primaryCityId;
      const additional = p.additionalCityIds.filter(cid => cid !== id);
      return { ...p, primaryCityId: primary, additionalCityIds: additional };
    }));
  }

  async function addContactMethodRecord(personId: string, platform: ContactMethod['platform'], value: string): Promise<string> {
    const id = uuidv4();
    const deepLink = buildDeepLink(platform, value);
    const method: ContactMethod = { id, personId, platform, value, deepLink };
    await db.insertContactMethod(method);
    setContactMethods(prev => [...prev, method]);
    return id;
  }

  async function updateContactMethodRecord(method: ContactMethod): Promise<void> {
    // update deepLink before saving
    method.deepLink = buildDeepLink(method.platform, method.value);
    await db.updateContactMethod(method);
    setContactMethods(prev => prev.map(cm => (cm.id === method.id ? method : cm)));
  }

  async function deleteContactMethodRecord(id: string): Promise<void> {
    await db.deleteContactMethod(id);
    setContactMethods(prev => prev.filter(cm => cm.id !== id));
  }

  async function addTripRecord(cityId: string, startDate: string, endDate: string, source: 'MANUAL' = 'MANUAL'): Promise<string> {
    const id = uuidv4();
    const trip: Trip = { id, cityId, startDate, endDate, source };
    await db.insertTrip(trip);
    setTrips(prev => [...prev, trip]);
    return id;
  }

  async function updateTripRecord(trip: Trip): Promise<void> {
    await db.updateTrip(trip);
    setTrips(prev => prev.map(t => (t.id === trip.id ? trip : t)));
  }

  async function deleteTripRecord(id: string): Promise<void> {
    await db.deleteTrip(id);
    setTrips(prev => prev.filter(t => t.id !== id));
  }

  const value: DataContextProps = {
    people,
    cities,
    contactMethods,
    trips,
    loading,
    getPeopleByCity,
    getContactMethodsForPerson,
    addPerson: addPerson,
    updatePerson: updatePersonRecord,
    deletePerson: deletePersonRecord,
    addCity: addCityRecord,
    updateCity: updateCityRecord,
    deleteCity: deleteCityRecord,
    addContactMethod: addContactMethodRecord,
    updateContactMethod: updateContactMethodRecord,
    deleteContactMethod: deleteContactMethodRecord,
    addTrip: addTripRecord,
    updateTrip: updateTripRecord,
    deleteTrip: deleteTripRecord,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export function useData(): DataContextProps {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}