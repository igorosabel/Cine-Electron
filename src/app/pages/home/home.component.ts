import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MoviesResult } from '@interfaces/interfaces';
import Movie from '@model/movie.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import NavigationService from '@services/navigation.service';
import ResponsiveService from '@services/responsive.service';
import MovieListComponent from '@shared/components/movie-list/movie-list.component';
import SidenavComponent from '@shared/components/sidenav/sidenav.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    SidenavComponent,
    RouterModule,
    MovieListComponent,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export default class HomeComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private ns: NavigationService = inject(NavigationService);
  private rs: ResponsiveService = inject(ResponsiveService);

  page: WritableSignal<number> = signal<number>(0);
  numPages: WritableSignal<number> = signal<number>(0);
  movies: WritableSignal<Movie[]> = signal<Movie[]>([]);
  loading: WritableSignal<boolean> = signal<boolean>(true);
  loadError: WritableSignal<boolean> = signal<boolean>(false);
  showMenu: WritableSignal<boolean> = signal<boolean>(false);
  sidenav: Signal<SidenavComponent> =
    viewChild.required<SidenavComponent>('sidenav');

  ngOnInit(): void {
    this.getMovies();
    this.ns.set(['/home']);
    this.rs.screenWidth$.subscribe((value: number | null): void => {
      this.showMenu.set(false);
      if (value !== null && value < ResponsiveService.SM) {
        this.showMenu.set(true);
      }
    });
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
    this.sidenav().toggleSidenav();
  }
}
