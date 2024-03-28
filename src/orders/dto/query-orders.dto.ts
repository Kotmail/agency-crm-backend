import { Expose, Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, Min } from 'class-validator'

export class QueryOrdersDto {
  @IsOptional()
  @IsIn(['opened', 'closed'])
  state?: string

  @IsOptional()
  @IsIn(['createdAt', 'deadline', 'cost'])
  sortby?: string = 'createdAt'

  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderby?: string = 'desc'

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number = 8

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
