import { ApiProperty } from '@nestjs/swagger'

export class PaginatedDto<TData> {
  @ApiProperty()
  items: TData[]

  @ApiProperty({
    example: 1,
  })
  totalCount: number
}
