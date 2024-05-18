import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User, UserRole } from './user.entity'
import { DeleteResult, In, Not, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { QueryUsersDto } from './dto/query-users.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const isEmailExists = await this.findByEmail(userDto.email)

    if (isEmailExists) {
      throw new BadRequestException('A user with such an e-mail already exists')
    }

    if (userDto.login) {
      const isLoginExist = await this.findByLogin(userDto.login)

      if (isLoginExist) {
        throw new BadRequestException('A user with this login already exists')
      }
    }

    return await this.usersRepository.save(userDto)
  }

  async update(
    authUser: User,
    id: number,
    userDto: UpdateUserDto,
  ): Promise<User> {
    if (authUser.role !== UserRole.ADMIN && authUser.id !== id) {
      throw new ForbiddenException(
        `You are not authorized to update a profile with ID ${id}`,
      )
    }

    if (userDto.email) {
      const isEmailExists = await this.usersRepository.findOneBy({
        id: Not(id),
        email: userDto.email,
      })

      if (isEmailExists) {
        throw new BadRequestException('The specified e-mail is busy')
      }
    }

    if (userDto.login) {
      const isLoginExists = await this.usersRepository.findOneBy({
        id: Not(id),
        login: userDto.login,
      })

      if (isLoginExists) {
        throw new BadRequestException('The specified login is busy')
      }
    }

    if (Object.keys(userDto).length) {
      await this.usersRepository.update(id, userDto)
    }

    return await this.usersRepository.findOneBy({ id })
  }

  findAll(authUser: User, queryDto: QueryUsersDto): Promise<[User[], number]> {
    return this.usersRepository.findAndCount({
      where: {
        role:
          authUser.role === UserRole.EXECUTOR
            ? UserRole.MANAGER
            : In(queryDto.role || Object.values(UserRole)),
      },
      order: {
        id: 'ASC',
      },
      take: queryDto.take,
      skip: queryDto.skip,
    })
  }

  async findOne(id: string): Promise<User> {
    const user = await this.findById(id)

    if (!user) {
      throw new NotFoundException('The user was not found')
    }

    return user
  }

  async delete(authUser: User, id: string): Promise<DeleteResult> {
    const user = await this.findById(id)

    if (!user) {
      throw new NotFoundException('The user was not found')
    }

    if (authUser.id === Number(id)) {
      throw new ForbiddenException('The user cannot delete himself')
    }

    return this.usersRepository.delete(id)
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
}
