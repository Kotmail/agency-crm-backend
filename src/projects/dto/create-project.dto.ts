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

  @IsOptional()
  @IsNumber()
  creator: number

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  members: number[]
}
