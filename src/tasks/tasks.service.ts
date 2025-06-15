import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { DeleteResult, In, Repository } from 'typeorm'
import { PaginatedDto } from 'src/shared/dto/paginated.dto'
import { QueryTasksDto } from './dto/query-tasks.dto'
import { User } from 'src/users/user.entity'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(authUser: User, taskDto: CreateTaskDto): Promise<Task> {
    const { id } = await this.tasksRepository.save({
      ...taskDto,
      creator: { id: taskDto.creator || authUser.id },
      project: { id: taskDto.project },
      boardStatus: { id: taskDto.boardStatus },
      responsibleUsers: taskDto.responsibleUsers
        ? taskDto.responsibleUsers.map((userId) => ({ id: userId }))
        : [],
    })

    return await this.tasksRepository.findOne({
      where: { id },
      relations: {
        creator: true,
        responsibleUsers: true,
      },
    })
  }

  async update(id: string, taskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id: Number(id) })

    if (!task) {
      throw new NotFoundException('The task was not found')
    }

    await this.tasksRepository.save({
      id: Number(id),
      ...taskDto,
      creator: taskDto.creator ? { id: taskDto.creator } : undefined,
      project: taskDto.project ? { id: taskDto.project } : undefined,
      boardStatus: taskDto.boardStatus
        ? { id: taskDto.boardStatus }
        : undefined,
      responsibleUsers: taskDto.responsibleUsers
        ? taskDto.responsibleUsers.map((userId) => ({ id: userId }))
        : undefined,
    })

    return await this.tasksRepository.findOne({
      where: { id: Number(id) },
      relations: {
        creator: true,
        responsibleUsers: true,
      },
    })
  }

  async findAll(queryDto: QueryTasksDto): Promise<PaginatedDto<Task>> {
    const [items, totalCount] = await this.tasksRepository.findAndCount({
      where: {
        boardStatus: queryDto.boardStatus
          ? In([queryDto.boardStatus])
          : undefined,
      },
      order: {
        id: 'ASC',
      },
      relations: {
        creator: true,
        responsibleUsers: true,
      },
      take: queryDto.take,
      skip: queryDto.skip,
    })

    return { items, totalCount }
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id: Number(id) },
      relations: {
        creator: true,
        responsibleUsers: true,
      },
    })

    if (!task) {
      throw new NotFoundException('The task was not found')
    }

    return task
  }

  async delete(id: string): Promise<DeleteResult> {
    const task = await this.tasksRepository.findOneBy({ id: Number(id) })

    if (!task) {
      throw new NotFoundException('The task was not found')
    }

    return this.tasksRepository.delete(id)
  }
}
