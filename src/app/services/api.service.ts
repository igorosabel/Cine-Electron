import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

import {
  CinemaInterface,
  CinemaResult,
  CinemasResult,
  LoginData,
  LoginResult,
  MovieInterface,
  MovieResult,
  MovieSearchDetailResult,
  MovieSearchResultList,
  MoviesResult,
  RegisterData,
  StatusResult,
} from "@interfaces/interfaces";

@Injectable({
  providedIn: "root",
})
export default class ApiService {
  private http: HttpClient = inject(HttpClient);

  apiUrl: string = environment.apiUrl;

  login(data: LoginData): Observable<LoginResult> {
    return this.http.post<LoginResult>(this.apiUrl + "login", data);
  }

  register(data: RegisterData): Observable<LoginResult> {
    return this.http.post<LoginResult>(this.apiUrl + "register", data);
  }

  getMovies(page: number): Observable<MoviesResult> {
    return this.http.post<MoviesResult>(this.apiUrl + "get-movies", { page });
  }

  getCinemas(): Observable<CinemasResult> {
    return this.http.post<CinemasResult>(this.apiUrl + "get-cinemas", {});
  }

  addCinema(name: string): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + "add-cinema", { name });
  }

  deleteCinema(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + "delete-cinema", { id });
  }

  editCinema(cinema: CinemaInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + "edit-cinema", cinema);
  }

  searchMovie(q: string): Observable<MovieSearchResultList> {
    return this.http.post<MovieSearchResultList>(this.apiUrl + "search-movie", {
      q,
    });
  }

  selectResult(id: number): Observable<MovieSearchDetailResult> {
    return this.http.post<MovieSearchDetailResult>(
      this.apiUrl + "select-result",
      { id }
    );
  }

  saveMovie(movie: MovieInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + "save-movie", movie);
  }

  getMovie(id: number): Observable<MovieResult> {
    return this.http.post<MovieResult>(this.apiUrl + "get-movie", { id });
  }

  getCinemaMovies(id: number): Observable<CinemaResult> {
    return this.http.post<CinemaResult>(this.apiUrl + "get-cinema-movies", {
      id,
    });
  }

  searchTitles(q: string): Observable<MoviesResult> {
    return this.http.post<MoviesResult>(this.apiUrl + "search-titles", { q });
  }
}
