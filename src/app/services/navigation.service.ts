import { Injectable } from "@angular/core";
import { NavigationFromType } from "@interfaces/interfaces";
import Cinema from "@model/cinema.model";

@Injectable({
  providedIn: "root",
})
export default class NavigationService {
  private from: NavigationFromType[] = [];
  private cinemas: Cinema[] = [];

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
    return this.cinemas;
  }

  setCinemas(cinemas: Cinema[]): void {
    this.cinemas = cinemas;
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
