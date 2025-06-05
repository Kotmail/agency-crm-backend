import { Type } from 'class-transformer'
import { IsInt } from 'class-validator'

export class QueryChecklistsDto {
  @IsInt()
  @Type(() => Number)
  taskId: number
}
