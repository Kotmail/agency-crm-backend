import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UserLogInDto {
  @ApiProperty({
    example: 'mail@example.com',
    description: 'E-mail address of user.',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    example: 'userPassword',
    description: 'Password of user.',
  })
  @IsNotEmpty()
  @IsString()
  password: string
}
