import {
  IsEnum,
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsPositive,
  MinLength,
} from 'class-validator'
import { OrderPriority, OrderStatus } from '../order.entity'

export class CreateOrderDto {
  @IsString()
  @MinLength(15)
  description: string

  @IsOptional()
  @IsString()
  @MinLength(10)
  objectAddress: string

  @IsString()
  @MinLength(5)
  brand: string

  @IsNumber()
  @IsPositive()
  cost: number

  @IsOptional()
  @IsNumber()
  creatorId: number

  @IsNumber()
  executorId: number

  @IsOptional()
  @IsEnum(OrderPriority)
  priority: OrderPriority

  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus

  @IsDateString()
  deadline: string

  @IsOptional()
  @IsBoolean()
  isArchived: boolean
}
