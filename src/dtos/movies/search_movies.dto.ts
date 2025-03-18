import { IsNotEmpty, IsString } from 'class-validator';

export class SearchMoviesDto {
  @IsNotEmpty()
  @IsString()
  searchText?: string;
}
