import { PartialType } from '@nestjs/swagger'
import { CreateUserDto } from './create-user.dto'
import { Transform } from 'class-transformer'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Transform(({ value }) => value || null)
  login: string

  @Transform(({ value }) => value || undefined)
  password: string
}
