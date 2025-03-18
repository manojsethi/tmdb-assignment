import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
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
    return this.moviesService.getMovies(query.page, query.limit);
  }

  @Get('search')
  searchMoviesByTitle(@Query(ValidationPipe) query: SearchMoviesDto) {
    return this.moviesService.searchMoviesByTitle(query);
  }

  @Get('filter/genre')
  filterMoviesByGenre(@Query(ValidationPipe) query: FilterMoviesByGenreDto) {
    return this.moviesService.filterMoviesByGenre(query.genre);
  }
}
