import { IsInt, IsNotEmpty, Min, Max, IsMongoId } from 'class-validator';

export class RateMovieDto {
  @IsNotEmpty()
  @IsMongoId()
  movieId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
