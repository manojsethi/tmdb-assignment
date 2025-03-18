import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { PaginationDto } from '../../dtos/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { SearchMoviesDto } from '../../dtos/movies/search_movies.dto';
import { FilterMoviesByGenreDto } from '../../dtos/movies/filter_movies_by_genre.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getMovies(@Query(ValidationPipe) query: PaginationDto) {
    try {
      return this.moviesService.getMovies(query.page, query.limit);
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

  @Get('search')
  searchMoviesByTitle(@Query(ValidationPipe) query: SearchMoviesDto) {
    try {
      return this.moviesService.searchMoviesByTitle(query);
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

  @Get('filter/genre')
  filterMoviesByGenre(@Query(ValidationPipe) query: FilterMoviesByGenreDto) {
    try {
      return this.moviesService.filterMoviesByGenre(query.genre);
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
