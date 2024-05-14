import {
  Component,
  ElementRef,
  OnInit,
  Signal,
  WritableSignal,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";
import { MoviesResult } from "@interfaces/interfaces";
import Movie from "@model/movie.model";
import ApiService from "@services/api.service";
import ClassMapperService from "@services/class-mapper.service";
import MovieListComponent from "@shared/components/movie-list/movie-list.component";

@Component({
  standalone: true,
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
  imports: [
    FormsModule,
    RouterModule,
    MovieListComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
  ],
})
export default class SearchComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);

  searchBox: Signal<ElementRef> = viewChild.required("searchBox");
  q: string | null = null;
  movies: WritableSignal<Movie[]> = signal<Movie[]>([]);
  searchTimer: number = -1;
  searching: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.searchBox().nativeElement.focus();
  }

  searchMovieStart(): void {
    this.searchMovieStop();
    this.searchTimer = window.setTimeout((): void => {
      this.searchMovie();
    }, 500);
  }

  searchMovieStop(): void {
    window.clearTimeout(this.searchTimer);
  }

  searchMovie(): void {
    if (this.q !== null && this.q.length >= 3) {
      this.searchMovieStop();
      this.searching.set(true);
      this.as.searchTitles(this.q).subscribe((result: MoviesResult): void => {
        this.searching.set(false);
        this.movies.set(this.cms.getMovies(result.list));
      });
    } else {
      this.movies.set([]);
    }
  }
}
