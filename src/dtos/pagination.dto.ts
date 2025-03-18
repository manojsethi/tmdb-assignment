import { IsInt, IsPositive, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @Max(15, { message: 'Limit cannot exceed 15.' })
  limit: 10;
}
