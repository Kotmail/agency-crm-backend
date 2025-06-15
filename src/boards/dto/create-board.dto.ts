import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @Transform(({ value }) =>
    typeof value === 'object' && value.id ? value.id : value,
  )
  project: number
}
