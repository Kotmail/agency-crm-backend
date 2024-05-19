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
import { ApiPropertyOptional } from '@nestjs/swagger'
import { OrderByQueryParam } from 'src/shared/enums/orderby-query-param.enum'

export enum SortByQueryParam {
  CREATED_AT = 'createdAt',
  DEADLINE = 'deadline',
  COST = 'cost',
}

export class QueryOrdersDto {
  @ApiPropertyOptional({
    enum: OrderPriority,
    isArray: true,
    description: 'Priorities of orders to be included in the selection.',
  })
  @IsOptional()
  @Transform(({ value }) => value.toString().split(','))
  @IsEnum(OrderPriority, { each: true })
  priority?: OrderPriority[]

  @ApiPropertyOptional({
    enum: OrderStatus,
    isArray: true,
    description: 'Statuses of orders to be included in the selection.',
  })
  @IsOptional()
  @Transform(({ value }) => value.toString().split(','))
  @IsEnum(OrderStatus, { each: true })
  status?: OrderStatus[]

  @ApiPropertyOptional({
    description: 'Will archived orders be included in the selection.',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isArchived?: boolean = false

  @ApiPropertyOptional({
    enum: SortByQueryParam,
    default: SortByQueryParam.CREATED_AT,
    description: 'Sorting field.',
  })
  @IsOptional()
  @IsEnum(SortByQueryParam)
  sortBy?: SortByQueryParam = SortByQueryParam.CREATED_AT

  @ApiPropertyOptional({
    enum: OrderByQueryParam,
    default: OrderByQueryParam.DESC,
    description: 'Sorting direction.',
  })
  @IsOptional()
  @IsEnum(OrderByQueryParam)
  orderBy?: OrderByQueryParam = OrderByQueryParam.DESC

  @ApiPropertyOptional({
    minimum: 1,
    example: 8,
    description: 'Displayed number of orders.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number = 8

  @ApiPropertyOptional({
    minimum: 1,
    example: 2,
    description: 'Current page.',
  })
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
