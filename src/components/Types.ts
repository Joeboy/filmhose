import type { DateTime } from 'luxon';
import { createContext } from 'react';

export interface Cinema {
  shortcode: string;
  shortname: string;
  name: string;
  url: string;
  address?: string;
  phone?: string;
  latitude: number;
  longitude: number;
}

export interface ShowTime {
  id: string;
  cinema_shortcode: string;
  cinema?: Cinema;
  title: string;
  norm_title: string;
  link: string;
  datetime: string;
  datetimeObj?: DateTime;
  description: string;
  image_src: string;
  thumbnail: string;
  last_updated: string;
  scraper: string;
}

export interface SearchSettings {
  selectedCinemas: string[];
  excludeManyShowings: boolean;
}

export const CinemasByShortcodeContext = createContext<Record<string, Cinema>>(
  {},
);

export interface SearchSettingsContextType {
  searchSettings: SearchSettings;
  setSearchSettings: (settings: SearchSettings) => void;
}

export const SearchSettingsContext = createContext<SearchSettingsContextType>({
  searchSettings: {
    selectedCinemas: [],
    excludeManyShowings: false,
  },
  setSearchSettings: () => {},
});

export interface LoadingShowtimesContextType {
  loadingShowtimes: boolean;
  setLoadingShowtimes: (loading: boolean) => void;
}

export const LoadingShowtimesContext =
  createContext<LoadingShowtimesContextType>({
    loadingShowtimes: true,
    setLoadingShowtimes: () => {},
  });

export const ShowtimesContext = createContext<ShowTime[]>([]);

export interface SelectedDateContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const SelectedDateContext = createContext<SelectedDateContextType>({
  selectedDate: '',
  setSelectedDate: () => {},
});
