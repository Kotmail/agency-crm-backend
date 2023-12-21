import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { DeleteResult, Repository } from 'typeorm'
import { CreateUserDto } from './create-user.dto'
import { hash } from 'bcrypt'
import { UpdateUserDto } from './update-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const isEmailExists = await this.findByEmail(userDto.email)

    if (isEmailExists) {
      throw new BadRequestException(
        'Пользователь с таким e-mail уже существует!',
      )
    }

    if (userDto.login) {
      const isLoginExist = await this.findByLogin(userDto.login)

      if (isLoginExist) {
        throw new BadRequestException(
          'Пользователь с таким логином уже существует!',
        )
      }
    }

    return await this.usersRepository.save({
      ...userDto,
      password: await hash(userDto.password, 5),
    })
  }

  async update(id: number, userDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(String(id))

    const hasUserByEmail = await this.findByEmail(userDto.email)

    if (hasUserByEmail && hasUserByEmail.id !== id) {
      throw new BadRequestException('Указанный e-mail занят.')
    }

    if (userDto.login) {
      const hasUserByLogin = await this.findByLogin(userDto.login)

      if (hasUserByLogin && hasUserByLogin.id !== id) {
        throw new BadRequestException('Указанный логин занят.')
      }
    }

    if (userDto.password) {
      user.password = await hash(userDto.password, 5)
    }

    if (userDto.role) {
      user.role = userDto.role
    }

    user.email = userDto.email
    user.login = userDto.login || null
    user.fullName = userDto.fullName

    return await this.usersRepository.save(user)
  }

  findById(id: string): Promise<User> {
    return this.usersRepository.findOneBy({ id: Number(id) })
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({
      email,
    })
  }

  findByLogin(login: string): Promise<User> {
    return this.usersRepository.findOneBy({
      login,
    })
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find()
  }

  delete(id: string): Promise<DeleteResult> {
    return this.usersRepository.delete(id)
  }
}
