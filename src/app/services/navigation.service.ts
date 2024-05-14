import { Injectable, inject } from '@angular/core';
import { CinemaInterface, NavigationFromType } from '@interfaces/interfaces';
import Cinema from '@model/cinema.model';
import ClassMapperService from './class-mapper.service';

@Injectable({
  providedIn: 'root',
})
export default class NavigationService {
  private cms: ClassMapperService = inject(ClassMapperService);
  private from: NavigationFromType[] = [];
  private cinemas: Cinema[] = [];
  private cinemasLoaded: boolean = false;

  get(): NavigationFromType {
    if (this.from.length > 0) {
      const elem: NavigationFromType | undefined = this.from.pop();
      if (elem !== undefined) {
        return elem;
      }
    }
    return [];
  }

  getLast(): NavigationFromType {
    if (this.from.length > 0) {
      return this.from[this.from.length - 1];
    }
    return [];
  }

  add(item: NavigationFromType): void {
    this.from.push(item);
  }

  set(item: NavigationFromType): void {
    this.from = [item];
  }

  getCinemas(): Cinema[] {
    if (!this.cinemasLoaded) {
      const data: string | null = localStorage.getItem('cinemas');
      if (data !== null) {
        const dataObj: CinemaInterface[] = JSON.parse(data);
        this.cinemas = dataObj.map((c: CinemaInterface): Cinema => {
          return this.cms.getCinema(c);
        });
      }
      this.cinemasLoaded;
    }
    return this.cinemas;
  }

  setCinemas(cinemas: Cinema[]): void {
    this.cinemas = cinemas;
    const data: string = JSON.stringify(
      this.cinemas.map((c: Cinema): CinemaInterface => {
        return c.toInterface();
      })
    );
    localStorage.setItem('cinemas', data);
    this.cinemasLoaded = true;
  }

  getCinema(id: number): Cinema | null {
    const cinema: Cinema | undefined = this.cinemas.find(
      (x: Cinema): boolean => x.id === id
    );
    if (cinema !== undefined) {
      return cinema;
    }
    return null;
  }

  updateCinema(cinema: Cinema): void {
    const ind: number = this.cinemas.findIndex(
      (x: Cinema): boolean => x.id === cinema.id
    );
    if (ind !== -1) {
      this.cinemas[ind] = cinema;
    } else {
      this.cinemas.push(cinema);
    }
  }
}
