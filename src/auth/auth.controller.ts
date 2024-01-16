import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { User } from 'src/user/user.entity'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  async verify(@CurrentUser() user: User) {
    const userData = await this.authService.getUserByIdFromJwt(String(user.id))

    return await this.authService.login(userData)
  }
}
