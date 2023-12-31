import { PartialType } from '@nestjs/mapped-types'
import { CreateOrderDto } from './create-order.dto'
import { IsBoolean, IsOptional } from 'class-validator'

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsBoolean()
  isArchived: boolean
}
