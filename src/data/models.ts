export type Tier = 'GREEN' | 'YELLOW' | 'ARCHIVE';

export interface Person {
  id: string;
  name: string | null;
  primaryCityId: string | null;
  additionalCityIds: string[];
  tier: Tier;
  notes: string | null;
  lastContactedAt: string | null;
  createdAt: string;
}

export interface City {
  id: string;
  name: string;
  state?: string | null;
  country?: string | null;
}

export type ContactPlatform =
  | 'PHONE'
  | 'SMS'
  | 'INSTAGRAM'
  | 'WHATSAPP'
  | 'TELEGRAM'
  | 'LINKEDIN'
  | 'TIKTOK'
  | 'EMAIL';

export interface ContactMethod {
  id: string;
  personId: string;
  platform: ContactPlatform;
  value: string;
  deepLink: string;
}

export interface Trip {
  id: string;
  cityId: string;
  startDate: string;
  endDate: string;
  source: 'MANUAL';
}