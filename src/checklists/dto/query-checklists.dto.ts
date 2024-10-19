import { Transform, Type } from 'class-transformer'
import { IsBoolean, IsInt } from 'class-validator'

export class QueryChecklistsDto {
  @IsInt()
  @Type(() => Number)
  taskId: number

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  includeItems?: boolean = false
}
