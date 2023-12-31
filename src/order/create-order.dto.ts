import {
  IsEnum,
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator'
import { OrderPriority, OrderStatus } from './order.entity'

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsString()
  brand: string

  @IsNumber()
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
}
