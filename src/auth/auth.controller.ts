import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { User } from 'src/users/user.entity'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { UserLogInDto } from './dto/user-log-in.dto'
import { Request } from 'express'
import { authSuccessResponseDto } from './dto/auth-success-response.dto'

@ApiTags('Auth')
@ApiUnauthorizedResponse({
  description: 'Unauthorized user.',
})
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User log in.' })
  @ApiBody({ type: UserLogInDto })
  @ApiOkResponse({
    type: authSuccessResponseDto,
    description: 'The user has been successfully logged in.',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request & { user: User }) {
    return await this.authService.login(req.user)
  }

  @ApiOperation({ summary: 'User verification.' })
  @ApiBearerAuth('Auth')
  @ApiOkResponse({
    type: authSuccessResponseDto,
    description: 'The user has been successfully verified.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('verify')
  async verify(@CurrentUser() user: User) {
    const userData = await this.authService.getUserByIdFromJwt(String(user.id))

    return await this.authService.login(userData)
  }
}
