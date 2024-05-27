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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateOrderDto {
  @ApiProperty({
    minLength: 15,
    example: 'Lorem ipsum dolor sit amet, consectetur...',
    description: 'Description of order.',
  })
  @IsString()
  @MinLength(15)
  description: string

  @ApiProperty({
    minimum: 1,
    example: 1000,
    description: 'Cost of order.',
  })
  @IsNumber()
  @IsPositive()
  cost: number

  @ApiPropertyOptional({
    example: 19,
    description: 'Manager of order.',
  })
  @IsOptional()
  @IsNumber()
  creatorId: number

  @ApiProperty({
    example: 24,
    description: 'Executor of order.',
  })
  @IsNumber()
  executorId: number

  @ApiPropertyOptional({
    enum: OrderPriority,
    default: OrderPriority.LOW,
    description: 'Priority of order.',
  })
  @IsOptional()
  @IsEnum(OrderPriority)
  priority: OrderPriority

  @ApiPropertyOptional({
    enum: OrderStatus,
    default: OrderStatus.WAITING,
    description: 'Status of order.',
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus

  @ApiProperty({
    description: 'Deadline of order.',
  })
  @IsDateString()
  deadline: string

  @ApiPropertyOptional({
    default: false,
    description: 'Is the order in the archive.',
  })
  @IsOptional()
  @IsBoolean()
  isArchived: boolean
}
