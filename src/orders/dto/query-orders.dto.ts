import { Expose, Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator'
import { OrderPriority, OrderStatus } from '../order.entity'

export class QueryOrdersDto {
  @IsOptional()
  @Transform(({ value }) => value.toString().split(','))
  @IsEnum(OrderPriority, { each: true })
  priority?: OrderPriority[]

  @IsOptional()
  @Transform(({ value }) => value.toString().split(','))
  @IsEnum(OrderStatus, { each: true })
  status?: OrderStatus[]

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isArchived?: boolean = false

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
