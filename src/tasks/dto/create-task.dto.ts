import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { TaskStatus } from '../task.entity'
import { PriorityEnum } from 'src/shared/enums/priority.enum'

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string

  @IsOptional()
  @IsDateString()
  dueDate: string

  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus

  @IsOptional()
  @IsEnum(PriorityEnum)
  priority: PriorityEnum

  @IsOptional()
  @IsNumber()
  creator: number

  @IsNumber()
  project: number

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  responsibleUsers: number[]
}
