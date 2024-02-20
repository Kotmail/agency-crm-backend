import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { compare } from 'bcrypt'
import { User } from 'src/users/user.entity'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email, true)

    if (user && (await compare(password, user.password))) {
      delete user.password

      return user
    }

    return null
  }

  async getUserByIdFromJwt(id: string) {
    return await this.usersService.findById(id)
  }

  async login(user: User) {
    return {
      user,
      access_token: this.jwtService.sign({ id: user.id, role: user.role }),
    }
  }
}
