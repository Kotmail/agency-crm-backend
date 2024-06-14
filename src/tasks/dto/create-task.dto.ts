import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { TaskPriority, TaskStatus } from '../task.entity'

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
  @IsEnum(TaskPriority)
  priority: TaskPriority

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
