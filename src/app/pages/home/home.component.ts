import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { MoviesResult } from '@interfaces/interfaces';
import Cinema from '@model/cinema.model';
import Movie from '@model/movie.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import NavigationService from '@services/navigation.service';
import UserService from '@services/user.service';
import MovieListComponent from '@shared/components/movie-list/movie-list.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    RouterModule,
    MovieListComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export default class HomeComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private user: UserService = inject(UserService);
  private router: Router = inject(Router);
  private cms: ClassMapperService = inject(ClassMapperService);
  private ns: NavigationService = inject(NavigationService);

  page: WritableSignal<number> = signal<number>(0);
  numPages: WritableSignal<number> = signal<number>(0);
  movies: WritableSignal<Movie[]> = signal<Movie[]>([]);
  cinemas: WritableSignal<Cinema[]> = signal<Cinema[]>([]);
  loading: WritableSignal<boolean> = signal<boolean>(true);
  loadError: WritableSignal<boolean> = signal<boolean>(false);
  opened: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.getMovies();
    this.cinemas.set(this.ns.getCinemas());
    this.ns.set(['/home']);
  }

  getMovies(ev: MouseEvent | null = null): void {
    ev && ev.preventDefault();
    this.page.update((value: number): number => {
      return value + 1;
    });
    this.as.getMovies(this.page()).subscribe({
      next: (result: MoviesResult): void => {
        this.movies.update((value: Movie[]): Movie[] => {
          value = value.concat(this.cms.getMovies(result.list));
          return value;
        });
        this.numPages.set(result.numPages);
        this.loading.set(false);
      },
      error: (): void => {
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }

  toggleSidenav(): void {
    this.opened.update((value: boolean): boolean => !value);
  }

  logout(ev: MouseEvent): void {
    ev.preventDefault();
    this.user.logout();
    this.router.navigate(['/']);
  }
}
