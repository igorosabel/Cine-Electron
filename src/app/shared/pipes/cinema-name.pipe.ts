import { Pipe, PipeTransform, inject } from "@angular/core";
import Cinema from "@model/cinema.model";
import NavigationService from "@services/navigation.service";

@Pipe({
  standalone: true,
  name: "cinemaName",
})
export default class CinemaNamePipe implements PipeTransform {
  private ns: NavigationService = inject(NavigationService);

  transform(id: number | null): string | null {
    if (id === null) {
      return null;
    }
    const cinema: Cinema | null = this.ns.getCinema(id);
    return cinema !== null ? cinema.name : null;
  }
}
