import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { DeleteResult, Not, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
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

    return await this.usersRepository.save(userDto)
  }

  async update(id: number, userDto: UpdateUserDto): Promise<User> {
    if (userDto.email) {
      const isEmailExists = await this.usersRepository.findOneBy({
        id: Not(id),
        email: userDto.email,
      })

      if (isEmailExists) {
        throw new BadRequestException('Указанный e-mail занят.')
      }
    }

    if (userDto.login) {
      const isLoginExists = await this.usersRepository.findOneBy({
        id: Not(id),
        login: userDto.login,
      })

      if (isLoginExists) {
        throw new BadRequestException('Указанный логин занят.')
      }
    }

    if (Object.keys(userDto).length) {
      await this.usersRepository.update(id, userDto)
    }

    return await this.usersRepository.findOneBy({ id })
  }

  findById(id: string): Promise<User> {
    return this.usersRepository.findOneBy({ id: Number(id) })
  }

  findByEmail(email: string, selectPassword: boolean = false): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
      select: {
        id: true,
        login: true,
        email: true,
        fullName: true,
        role: true,
        password: selectPassword,
      },
    })
  }

  findByLogin(login: string, selectPassword: boolean = false): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        login,
      },
      select: {
        id: true,
        login: true,
        email: true,
        fullName: true,
        role: true,
        password: selectPassword,
      },
    })
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: {
        id: 'ASC',
      },
    })
  }

  delete(id: string): Promise<DeleteResult> {
    return this.usersRepository.delete(id)
  }
}
