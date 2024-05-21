import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/users/user.entity'

export class authSuccessResponseDto {
  @ApiProperty()
  user: User

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE2MjkxODg4LCJleHAiOjE3MTcxNTU4ODh9.WkJ_0qYBNqVT4RlTw_0QhYFllaZZKLEpS99iiO52_60',
  })
  access_token: string
}
