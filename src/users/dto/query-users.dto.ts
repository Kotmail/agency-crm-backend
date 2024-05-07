import { Expose, Transform, Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator'
import { UserRole } from '../user.entity'

export class QueryUsersDto {
  @IsOptional()
  @Transform(({ value }) => value.toString().split(','))
  @IsEnum(UserRole, { each: true })
  role?: UserRole[]

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number = 8

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
