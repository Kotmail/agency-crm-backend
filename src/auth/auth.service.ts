import { Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { compare } from 'bcrypt'
import { User } from 'src/user/user.entity'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email, true)

    if (user && (await compare(password, user.password))) {
      return user
    }

    return null
  }

  async login(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
    }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
