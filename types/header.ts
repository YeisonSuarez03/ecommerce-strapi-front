import { StrapiMedia } from "./globals.strapi";

export interface HeaderLink {
  id: number;
  label: string;
  link: string;
  isPrimary: boolean;
  isExternal: boolean;
  isActive: boolean;
}

export interface HeaderData {
  id: number;
  logo: StrapiMedia;
  links: HeaderLink[];
}

export interface FooterData {
  id: number;
  logo: StrapiMedia;
  links: HeaderLink[];
  text: string;
}

export interface GlobalHeader {
  Header: HeaderData;
}

export interface GlobalFooter {
  Footer: FooterData;
} 