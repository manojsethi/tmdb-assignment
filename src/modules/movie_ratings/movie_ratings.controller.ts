import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MovieRatingsService } from './movie_ratings.service';
import { RateMovieDto } from '../../dtos/movie_ratings/rate_movie.dto';
import ExtendedRequest from '../../interfaces/extended_request';

@UseGuards(AuthGuard('jwt'))
@Controller('movies')
export class MovieRatingsController {
  constructor(private readonly movieRatingsService: MovieRatingsService) {}

  @Post('rating')
  rateMovie(@Body() body: RateMovieDto, @Req() req: ExtendedRequest) {
    return this.movieRatingsService.rateMovie(body, req.user);
  }
}
