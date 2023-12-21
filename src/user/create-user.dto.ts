import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { UserRole } from './user.entity'

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

  @IsNotEmpty()
  password: string
}
