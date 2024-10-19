import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateChecklistDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  taskId: number
}
