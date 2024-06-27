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
import { Exclude } from 'class-transformer'

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
    example: 'Allen',
    description: 'Name of user.',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string

  @ApiProperty({
    example: 'Brown',
    description: 'Surname of user.',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string

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
  @Exclude({ toPlainOnly: true })
  password: string
}
