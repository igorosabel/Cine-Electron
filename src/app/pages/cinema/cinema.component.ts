import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { CinemaResult, NavigationFromType } from "@interfaces/interfaces";
import Cinema from "@model/cinema.model";
import Movie from "@model/movie.model";
import ApiService from "@services/api.service";
import ClassMapperService from "@services/class-mapper.service";
import DialogService from "@services/dialog.service";
import NavigationService from "@services/navigation.service";
import MovieListComponent from "@shared/components/movie-list/movie-list.component";

@Component({
  standalone: true,
  selector: "app-cinema",
  templateUrl: "./cinema.component.html",
  imports: [
    MovieListComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
})
export default class CinemaComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private dialog: DialogService = inject(DialogService);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private ns: NavigationService = inject(NavigationService);

  cinemas: WritableSignal<Cinema[]> = signal<Cinema[]>([]);
  cinema: WritableSignal<Cinema> = signal<Cinema>(new Cinema());
  movies: WritableSignal<Movie[]> = signal<Movie[]>([]);

  ngOnInit(): void {
    this.cinemas.set(this.ns.getCinemas());
    if (this.cinemas().length == 0) {
      this.router.navigate(["/home"]);
    }
    this.activatedRoute.params.subscribe((params: Params): void => {
      const id: number = params["id"];
      const cinemaFound: Cinema | null = this.ns.getCinema(id);
      if (cinemaFound !== null) {
        this.cinema.set(cinemaFound);
      }

      this.as.getCinemaMovies(id).subscribe((result: CinemaResult): void => {
        if (result.status == "ok") {
          this.movies.set(this.cms.getMovies(result.list));

          const fromCinema: NavigationFromType = [
            "/cinema",
            this.cinema().id,
            this.cinema().slug,
          ];
          const lastItem: NavigationFromType = this.ns.getLast();
          if (lastItem.join("") != fromCinema.join("")) {
            this.ns.add(fromCinema);
          }
        } else {
          this.dialog
            .alert({
              title: "Error",
              content: "No se ha encontrado el cine indicado.",
              ok: "Continuar",
            })
            .subscribe((): void => {
              this.router.navigate(["/home"]);
            });
        }
      });
    });
  }

  back(): void {
    const current: NavigationFromType = this.ns.get();
    const previous: NavigationFromType = this.ns.get();
    this.router.navigate(previous);
  }
}
