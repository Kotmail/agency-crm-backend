import { IsIn, IsOptional } from 'class-validator'

export class QueryOrdersDto {
  @IsOptional()
  @IsIn(['opened', 'closed'])
  state?: string
}
