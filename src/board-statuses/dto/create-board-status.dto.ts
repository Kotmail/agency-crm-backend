import { IsNotEmpty, IsString } from 'class-validator'

export class CreateBoardStatusDto {
  @IsString()
  @IsNotEmpty()
  name: string
}
