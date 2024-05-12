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

export class CreateUserDto {
  @IsString()
  @IsOptional()
  login: string

  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  fullName: string

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole

  @IsStrongPassword()
  @MinLength(10)
  password: string
}
