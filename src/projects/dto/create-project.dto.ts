import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsNumber()
  creator: number

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  members: number[]
}
