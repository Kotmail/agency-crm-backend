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
import { User } from 'src/users/user.entity'

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
  @Transform(({ value }) =>
    value.map((item: number | User) =>
      typeof item === 'object' ? item.id : item,
    ),
  )
  members: number[]
}
