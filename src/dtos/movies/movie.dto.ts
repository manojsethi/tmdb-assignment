import { IsInt, IsNotEmpty, IsPositive, Min, Max } from 'class-validator';

export class MovieRatingDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  movieId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
