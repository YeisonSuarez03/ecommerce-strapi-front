import { StrapiMedia } from "./globals.strapi";

export interface PrincipalBanner {
  id: number;
  title: string;
  description: string;
  buttonLink: string;
  media?: StrapiMedia;
} 