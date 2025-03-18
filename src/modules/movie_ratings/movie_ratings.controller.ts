import {
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
  Body,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MovieRatingsService } from './movie_ratings.service';
import { RateMovieDto } from '../../dtos/movie_ratings/rate_movie.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('movies/rating')
export class MovieRatingsController {
  constructor(private readonly movieRatingsService: MovieRatingsService) {}

  @Post()
  rateMovie(@Body(ValidationPipe) body: RateMovieDto, @Req() req: any) {
    try {
      return this.movieRatingsService.rateMovie(body, req.user);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error!',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
