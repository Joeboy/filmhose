import { createContext } from 'react';

export interface Cinema {
  shortname?: string;
  name: string;
  url: string;
  address?: string;
  phone?: string;
  latitude: number;
  longitude: number;
}

export type CinemaMap = Record<string, Cinema>;

export const CinemaContext = createContext<CinemaMap>({});
