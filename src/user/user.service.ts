import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { DeleteResult, Not, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    return await this.userRepository.save(userDto)
  }

  async update(id: number, userDto: UpdateUserDto): Promise<User> {
    if (userDto.email) {
      const isEmailExists = await this.userRepository.findOneBy({
        id: Not(id),
        email: userDto.email,
      })

      if (isEmailExists) {
        throw new BadRequestException('Указанный e-mail занят.')
      }
    }

    if (userDto.login) {
      const isLoginExists = await this.userRepository.findOneBy({
        id: Not(id),
        login: userDto.login,
      })

      if (isLoginExists) {
        throw new BadRequestException('Указанный логин занят.')
      }
    }

    if (Object.keys(userDto).length) {
      await this.userRepository.update(id, userDto)
    }

    return await this.userRepository.findOneBy({ id })
  }

  findById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id: Number(id) })
  }

  findByEmail(email: string, selectPassword: boolean = false): Promise<User> {
    return this.userRepository.findOne({
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
    return this.userRepository.findOne({
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
    return this.userRepository.find({
      order: {
        id: 'ASC',
      },
    })
  }

  delete(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id)
  }
}
