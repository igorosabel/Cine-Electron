import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatList,
  MatListItem,
  MatListItemLine,
  MatListItemMeta,
  MatListItemTitle,
  MatNavList,
} from '@angular/material/list';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MovieResult, NavigationFromType } from '@interfaces/interfaces';
import Cinema from '@model/cinema.model';
import Movie from '@model/movie.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import DialogService from '@services/dialog.service';
import NavigationService from '@services/navigation.service';
import CinemaNamePipe from '@shared/pipes/cinema-name.pipe';

@Component({
  standalone: true,
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
  imports: [
    NgClass,
    CinemaNamePipe,
    MatToolbar,
    MatToolbarRow,
    MatIconButton,
    MatIcon,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatList,
    MatNavList,
    MatListItem,
    MatListItemTitle,
    MatListItemLine,
    MatListItemMeta,
    NgOptimizedImage,
  ],
})
export default class MovieComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private dialog: DialogService = inject(DialogService);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private ns: NavigationService = inject(NavigationService);

  cinemas: WritableSignal<Cinema[]> = signal<Cinema[]>([]);
  selectedCinema: WritableSignal<Cinema | null> = signal<Cinema>(new Cinema());
  movie: WritableSignal<Movie> = signal<Movie>(new Movie());
  showCover: WritableSignal<boolean> = signal<boolean>(false);
  movieCover: string = '';

  ngOnInit(): void {
    this.cinemas.set(this.ns.getCinemas());
    if (this.cinemas().length == 0) {
      this.router.navigate(['/home']);
    }
    this.activatedRoute.params.subscribe((params: Params): void => {
      const id: number = params['id'];
      this.as.getMovie(id).subscribe((result: MovieResult): void => {
        if (result.status == 'ok') {
          const movie: Movie = this.cms.getMovie(result.movie);
          const idCinema: number | null = movie.idCinema;
          if (idCinema !== null) {
            this.selectedCinema.set(this.ns.getCinema(idCinema));
          }
          if (movie.cover !== null) {
            this.movieCover = movie.cover;
          }

          const fromMovie: NavigationFromType = [
            '/movie',
            movie.id,
            movie.slug,
          ];
          const lastItem: NavigationFromType = this.ns.getLast();
          if (lastItem.join('') != fromMovie.join('')) {
            this.ns.add(fromMovie);
          }
          this.movie.set(movie);
        } else {
          this.dialog
            .alert({
              title: 'Error',
              content: 'No se ha encontrado la película indicada.',
              ok: 'Continuar',
            })
            .subscribe((): void => {
              this.router.navigate(['/home']);
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

  openCover(): void {
    this.showCover.update((value: boolean): boolean => !value);
  }

  selectCinema(): void {
    this.router.navigate([
      '/cinema',
      this.selectedCinema()?.id,
      this.selectedCinema()?.slug,
    ]);
  }
}
