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
import { Transform } from 'class-transformer'
import { User } from 'src/users/user.entity'

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
  @Transform(({ value }) =>
    typeof value === 'object' && value.id ? value.id : value,
  )
  creator: number

  @IsNumber()
  @Transform(({ value }) =>
    typeof value === 'object' && value.id ? value.id : value,
  )
  project: number

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) =>
    value.map((item: number | User) =>
      typeof item === 'object' ? item.id : item,
    ),
  )
  responsibleUsers: number[]
}
