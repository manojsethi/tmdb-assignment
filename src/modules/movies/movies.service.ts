import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './movie.schema';
import { ApiResponse } from '../../dtos/api_response.dto';
import { TmdbService } from './tmdb.service';
import { Cron } from '@nestjs/schedule';
import { SearchMoviesDto } from '../../dtos/movies/search_movies.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,

    private readonly tmdbService: TmdbService,
  ) {}

  async syncMoviesFromTMDB(): Promise<ApiResponse> {
    try {
      const movies = await this.tmdbService.fetchPopularMovies();
      if (!movies || movies.length === 0) {
        return { status: HttpStatus.NO_CONTENT, message: 'No movies found!' };
      }

      const bulkOperations = movies.map((movie) => ({
        updateOne: {
          filter: { movieId: movie.movieId },
          update: { $set: movie },
          upsert: true,
        },
      }));

      await this.movieModel.bulkWrite(bulkOperations);

      return {
        data: null,
        status: HttpStatus.CREATED,
        message: 'Movies synced!',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to fetch movies from TMDB',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Cron('0 * * * *')
  async handleMovieSyncCron() {
    await this.syncMoviesFromTMDB();
  }

  async getMovies(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<Movie[]>> {
    try {
      const movies = await this.movieModel
        .find()
        .sort({ releaseDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      return {
        status: HttpStatus.OK,
        data: movies,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch movies from TMDB',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchMoviesByTitle(
    data: SearchMoviesDto,
  ): Promise<ApiResponse<Movie[]>> {
    try {
      const { searchText } = data;

      const movies = await this.movieModel.find({
        $or: [
          { title: { $regex: searchText, $options: 'i' } },
          { overview: { $regex: searchText, $options: 'i' } },
        ],
      });

      return { status: HttpStatus.OK, data: movies };
    } catch (error: any) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch movies!',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async filterMoviesByGenre(genre: string[]): Promise<ApiResponse<Movie[]>> {
    try {
      const movies = await this.movieModel.aggregate([
        {
          $match: {
            $expr: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: '$genre',
                      as: 'g',
                      cond: {
                        $in: [
                          { $toLower: '$$g' },
                          genre.map((g) => g.toLowerCase()),
                        ],
                      },
                    },
                  },
                },
                0,
              ],
            },
          },
        },
      ]);

      return { status: HttpStatus.OK, data: movies };
    } catch (error: any) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to filter movies!',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
