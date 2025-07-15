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

export const CinemasByShortcodeContext = createContext<Record<string, Cinema>>(
  {}
);
