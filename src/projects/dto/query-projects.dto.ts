import { Expose, Type } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'

export class QueryProjectsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number = 12

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @Expose()
  get skip(): number {
    return (this.page - 1) * this.take
  }
}
