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
  link: string;
  datetime: string;
  description: string;
  image_src: string;
  thumbnail: string;
  last_updated: string;
  scraper: string;
}
export const CinemaContext = createContext<Cinema[]>([]);
