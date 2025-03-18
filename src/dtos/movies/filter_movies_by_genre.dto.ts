import { IsArray } from 'class-validator';

export class FilterMoviesByGenreDto {
  @IsArray()
  genre: string[];
}
