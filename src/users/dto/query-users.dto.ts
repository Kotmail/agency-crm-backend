import { Expose, Transform, Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator'
import { UserRole } from '../user.entity'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class QueryUsersDto {
  @ApiPropertyOptional({
    enum: UserRole,
    isArray: true,
    description: 'User roles to be included in the selection.',
  })
  @IsOptional()
  @Transform(({ value }) => value.toString().split(','))
  @IsEnum(UserRole, { each: true })
  role?: UserRole[]

  @ApiPropertyOptional({
    minimum: 1,
    example: 8,
    description: 'Displayed number of users.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number = 8

  @ApiPropertyOptional({
    minimum: 1,
    example: 2,
    description: 'Current page.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @Expose()
  get skip(): number {
    return (this.page - 1) * this.take
  }
}
