export interface LoginData {
  name: string;
  pass: string;
}

export interface LoginResult {
  status: string;
  id: number | null;
  name: string | null;
  token: string | null;
}

export interface RegisterData {
  name: string;
  pass: string;
  conf: string;
}

export interface MovieInterface {
  id: number | null;
  idCinema: number | null;
  name: string | null;
  slug: string | null;
  cover: string | null;
  coverStatus?: number;
  ticket: string | null;
  ticketStatus?: number;
  imdbUrl: string | null;
  date: string | null;
}

export interface MoviesResult {
  status: string;
  numPages: number;
  list: MovieInterface[];
}

export interface MovieResult {
  status: string;
  movie: MovieInterface;
}

export interface CinemaInterface {
  id: number | null;
  name: string | null;
  slug: string | null;
}

export interface CinemasResult {
  status: string;
  list: CinemaInterface[];
}

export interface CinemaResult {
  status: string;
  list: MovieInterface[];
}

export interface DialogField {
  title: string;
  type: string;
  value: string;
  hint?: string;
}

export interface DialogOptions {
  title: string;
  content: string;
  fields?: DialogField[] | undefined;
  ok?: string | undefined;
  cancel?: string | undefined;
}

export interface StatusResult {
  status: string;
}

export interface MovieSearchResult {
  id: number;
  title: string | null;
  poster: string | null;
}

export interface MovieSearchResultList {
  status: string;
  list: MovieSearchResult[];
}

export interface MovieSearchDetailResult {
  status: string;
  title: string | null;
  poster: string | null;
  imdbUrl: string | null;
}

export type NavigationFromType = (string | number | null)[];
