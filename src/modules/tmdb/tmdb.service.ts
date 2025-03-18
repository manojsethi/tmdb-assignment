import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { IGenre } from '../../interfaces/genre';
import { Movie } from '../movies/movie.schema';
import { ITMDBMovie } from '../../interfaces/tmdb';

@Injectable()
export class TmdbService {
  private genreMap: { [key: number]: string } = {};

  constructor() {
    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.loadGenres();
  }

  private getGenreNames(genreIds: number[]): string[] {
    return genreIds.map((id) => this.genreMap[id]);
  }

  private async loadGenres(): Promise<void> {
    try {
      const response: { data: { genres: IGenre[] } } = await axios.get(
        `${process.env.TMDB_BASE_URL}/genre/movie/list`,
        {
          params: { api_key: process.env.TMDB_API_KEY },
        },
      );

      this.genreMap = response.data.genres.reduce(
        (map: { [key: number]: string }, genre: IGenre) => {
          map[genre.id] = genre.name;

          return map;
        },
        {},
      );
    } catch (error: any) {
      console.error(`Failed to load TMDB genres error: ${error}`);

      this.genreMap = [];
    }
  }

  async fetchPopularMovies(): Promise<Movie[]> {
    try {
      const response: { data: { results: ITMDBMovie[] } } = await axios.get(
        `${process.env.TMDB_BASE_URL}/movie/popular`,
        {
          params: { api_key: process.env.TMDB_API_KEY },
        },
      );

      return response.data.results.map(
        (movie: ITMDBMovie): Movie => ({
          movieId: movie.id,
          title: movie.title,
          overview: movie.overview,
          genre: this.getGenreNames(movie.genre_ids),
          releaseDate: movie.release_date,
          posterPath: movie.poster_path,
          rating: 0,
        }),
      );
    } catch (error: any) {
      throw new HttpException(
        'Failed to fetch movies from TMDB',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
