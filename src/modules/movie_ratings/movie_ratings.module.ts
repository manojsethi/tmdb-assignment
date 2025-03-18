import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieRating, MovieRatingSchema } from './movie_rating.schema';
import { MovieRatingsController } from './movie_ratings.controller';
import { MovieRatingsService } from './movie_ratings.service';
import { Movie, MovieSchema } from '../movies/movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MovieRating.name, schema: MovieRatingSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
  controllers: [MovieRatingsController],
  providers: [MovieRatingsService],
  exports: [],
})
export class MovieRatingsModule {}
