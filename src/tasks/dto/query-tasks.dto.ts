import { Expose, Transform, Type } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'

export class QueryTasksDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  projectId?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Transform(({ value }) => (value >= 1 ? value : undefined))
  take?: number = 8

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @Expose()
  get skip(): number {
    if (!this.take) {
      return undefined
    }

    return (this.page - 1) * this.take
  }
}
