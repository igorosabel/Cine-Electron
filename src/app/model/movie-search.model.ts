import {
  MovieSearchDetailResult,
  MovieSearchResult,
} from "@interfaces/interfaces";
import Utils from "@model/utils.class";

export default class MovieSearch {
  constructor(
    public status: string = "",
    public id: number = 0,
    public title: string | null = "",
    public poster: string | null = "",
    public imdbUrl: string | null = null
  ) {}

  fromInterface(
    status: string,
    msr: MovieSearchResult,
    imdbUrl: string
  ): MovieSearch {
    this.status = status;
    this.id = msr.id;
    this.title = Utils.urldecode(msr.title);
    this.poster = Utils.urldecode(msr.poster);
    this.imdbUrl = imdbUrl ? Utils.urldecode(imdbUrl) : null;

    return this;
  }

  toDetailInterface(): MovieSearchDetailResult {
    return {
      status: this.status,
      title: Utils.urlencode(this.title),
      poster: Utils.urlencode(this.poster),
      imdbUrl: this.imdbUrl ? Utils.urlencode(this.imdbUrl) : null,
    };
  }

  toSearchInterface(): MovieSearchResult {
    return {
      id: this.id,
      title: Utils.urlencode(this.title),
      poster: Utils.urlencode(this.poster),
    };
  }
}
