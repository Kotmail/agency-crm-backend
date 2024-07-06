import { Transform } from 'class-transformer'
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { PriorityEnum } from 'src/shared/enums/priority.enum'

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string

  @IsOptional()
  @IsDateString()
  dueDate: string

  @IsOptional()
  @IsEnum(PriorityEnum)
  priority: PriorityEnum

  @IsNumber()
  @Transform(({ value }) =>
    typeof value === 'object' && value.id ? value.id : value,
  )
  creator: number

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  memberIds: number[]
}
