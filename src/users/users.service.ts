import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User, UserRole } from './user.entity'
import { DeleteResult, Not, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { QueryUsersDto } from './dto/query-users.dto'
import { PaginatedDto } from 'src/shared/dto/paginated.dto'

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
    const user = await this.findById(String(id))

    if (!user) {
      throw new NotFoundException('The user was not found')
    }

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

  async findAll(queryDto: QueryUsersDto): Promise<PaginatedDto<User>> {
    const usersQuery = this.usersRepository
      .createQueryBuilder()
      .orderBy('id', 'ASC')
      .take(queryDto.take)
      .skip(queryDto.skip)

    if (queryDto.q) {
      usersQuery.where(
        "CONCAT(first_name, ' ', last_name) ILIKE :query OR CONCAT(last_name, ' ', first_name) ILIKE :query OR email ILIKE :query",
        { query: `%${queryDto.q}%` },
      )
    }

    const [items, totalCount] = await usersQuery.getManyAndCount()

    return { items, totalCount }
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
        firstName: true,
        lastName: true,
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
        firstName: true,
        lastName: true,
        role: true,
        password: selectPassword,
      },
    })
  }
}
