import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator'
import { UserRole } from '../user.entity'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiPropertyOptional({
    nullable: true,
    default: null,
    example: 'AllenBwn',
    description: 'Login of user.',
  })
  @IsOptional()
  @IsString()
  login: string | null

  @ApiProperty({
    example: 'mail@example.com',
    description: 'E-mail address of user.',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    example: 'Allen Brown',
    description: 'Fullname of user.',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string

  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.EXECUTOR,
    description: 'Role of user.',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole

  @ApiProperty({
    minimum: 10,
    description: 'Password of user.',
  })
  @IsStrongPassword()
  @MinLength(10)
  password: string
}
