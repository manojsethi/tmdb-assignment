import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { IGenre } from '../../interfaces/genre';
import { Movie } from './movie.schema';

@Injectable()
export class TmdbService {
  private genreMap: { [key: number]: string } = {};

  constructor() {
    this.loadGenres();
  }

  private getGenreNames(genreIds: number[]): string[] {
    return genreIds.map((id) => this.genreMap[id]);
  }

  private async loadGenres(): Promise<void> {
    try {
      const response = await axios.get(
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
      console.error('Failed to load TMDB genres', error.message);
    }
  }

  async fetchPopularMovies(): Promise<Movie[]> {
    try {
      const response = await axios.get(
        `${process.env.TMDB_BASE_URL}/movie/popular`,
        {
          params: { api_key: process.env.TMDB_API_KEY },
        },
      );
      return response.data.results.map((movie: any) => ({
        movieId: movie.id,
        title: movie.title,
        overview: movie.overview,
        genre: this.getGenreNames(movie.genre_ids),
        releaseDate: movie.release_date,
        posterPath: movie.poster_path,
      }));
    } catch (error) {
      throw new HttpException(
        'Failed to fetch movies from TMDB',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchMovieById(movieId: number): Promise<any> {
    try {
      const response = await axios.get(
        `${process.env.TMDB_BASE_URL}/movie/${movieId}`,
        {
          params: { api_key: process.env.TMDB_API_KEY },
        },
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch movie details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
