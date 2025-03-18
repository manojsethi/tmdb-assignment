import { InjectModel } from '@nestjs/mongoose';
import { ApiResponse } from '../../dtos/api_response.dto';
import { RateMovieDto } from '../../dtos/movie_ratings/rate_movie.dto';
import { MovieRating, MovieRatingDocument } from './movie_rating.schema';
import mongoose, { Model } from 'mongoose';
import { IUser } from '../../interfaces/user';
import { Movie, MovieDocument } from '../movies/movie.schema';
import { HttpStatus } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

export class MovieRatingsService {
  constructor(
    @InjectModel(MovieRating.name)
    private movieRatingModel: Model<MovieRatingDocument>,
    private readonly loggerService: LoggerService,

    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}
  async rateMovie(data: RateMovieDto, user: IUser): Promise<ApiResponse> {
    try {
      const movie = await this.movieModel.findById(data.movieId);
      if (!movie) {
        return { status: HttpStatus.NOT_FOUND, message: 'Movie not found!' };
      }

      const isAlreadyRated = await this.movieRatingModel.findOne({
        user: user._id,
        movie: new mongoose.Types.ObjectId(data.movieId.toString()),
      });
      if (isAlreadyRated) {
        return { status: HttpStatus.CONFLICT, message: 'Movie already rated!' };
      }

      await this.movieRatingModel.create({
        ...data,
        user: user._id,
        movie: movie._id,
      });
      const updatedAverageRating = await this.calculateAverageRating(movie._id);

      movie.rating = updatedAverageRating;
      await movie.save();

      return { status: HttpStatus.CREATED, message: 'Rating added!' };
    } catch (error: any) {
      this.loggerService.error(
        `An error occurred while rating the movie ${error}, payload: ${JSON.stringify(data)}`,
      );

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong!',
      };
    }
  }

  async calculateAverageRating(movieId: unknown): Promise<number> {
    const ratings = await this.movieRatingModel.find({ movie: movieId });

    if (ratings.length === 0) return 0;

    const avgRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    return Number(avgRating.toFixed(1));
  }
}
