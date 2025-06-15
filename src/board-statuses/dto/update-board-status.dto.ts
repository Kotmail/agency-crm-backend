import { PartialType } from '@nestjs/mapped-types'
import { CreateBoardStatusDto } from './create-board-status.dto'
import { IsNumber, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

export class UpdateBoardStatusDto extends PartialType(CreateBoardStatusDto) {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) =>
    typeof value === 'object' && value.id ? value.id : value,
  )
  board: number
}
