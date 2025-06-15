import { Expose, Transform, Type } from 'class-transformer'
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator'

export class QueryBoardsDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  projectId?: number

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  includeStatuses?: boolean

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
