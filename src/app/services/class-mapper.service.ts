import { Injectable } from "@angular/core";
import {
  CinemaInterface,
  MovieInterface,
  MovieSearchDetailResult,
  MovieSearchResult,
} from "@interfaces/interfaces";
import Cinema from "@model/cinema.model";
import MovieSearch from "@model/movie-search.model";
import Movie from "@model/movie.model";

@Injectable({
  providedIn: "root",
})
export default class ClassMapperService {
  getCinemas(cs: CinemaInterface[]): Cinema[] {
    return cs.map((c: CinemaInterface): Cinema => {
      return this.getCinema(c);
    });
  }

  getCinema(c: CinemaInterface): Cinema {
    return new Cinema().fromInterface(c);
  }

  getMovies(ms: MovieInterface[]): Movie[] {
    return ms.map((m: MovieInterface): Movie => {
      return this.getMovie(m);
    });
  }

  getMovie(m: MovieInterface): Movie {
    return new Movie().fromInterface(m);
  }

  getMovieSearches(mss: MovieSearchResult[]): MovieSearch[] {
    return mss.map((ms: MovieSearchResult): MovieSearch => {
      return this.getMovieSearch(ms);
    });
  }

  getMovieSearch(msr: MovieSearchResult): MovieSearch {
    return new MovieSearch().fromInterface("ok", msr, "");
  }

  getMovieDetail(msd: MovieSearchDetailResult): MovieSearch {
    return new MovieSearch().fromInterface(
      msd.status,
      { id: -1, title: msd.title, poster: msd.poster },
      msd.imdbUrl !== null ? msd.imdbUrl : ""
    );
  }
}
