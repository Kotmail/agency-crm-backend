import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { DeleteResult, Repository } from 'typeorm'
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

  create(authUser: User, taskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.save({
      ...taskDto,
      creator: { id: taskDto.creator || authUser.id },
      project: { id: taskDto.project },
      responsibleUsers: taskDto.responsibleUsers
        ? taskDto.responsibleUsers.map((userId) => ({ id: userId }))
        : [],
    })
  }

  async update(id: string, taskDto: UpdateTaskDto): Promise<Task> {
    const taskData = await this.findById(id)

    if (!taskData) {
      throw new NotFoundException('The task was not found')
    }

    await this.tasksRepository.save({
      id: Number(id),
      ...taskDto,
      creator: taskDto.creator ? { id: taskDto.creator } : undefined,
      project: taskDto.project ? { id: taskDto.project } : undefined,
      responsibleUsers: taskDto.responsibleUsers
        ? taskDto.responsibleUsers.map((userId) => ({ id: userId }))
        : undefined,
    })

    return await this.findById(id)
  }

  async findAll(queryDto: QueryTasksDto): Promise<PaginatedDto<Task>> {
    const [items, totalCount] = await this.tasksRepository.findAndCount({
      order: {
        id: 'ASC',
      },
      take: queryDto.take,
      skip: queryDto.skip,
    })

    return { items, totalCount }
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.findById(id)

    if (!task) {
      throw new NotFoundException('The task was not found')
    }

    return task
  }

  async delete(id: string): Promise<DeleteResult> {
    const task = await this.findById(id)

    if (!task) {
      throw new NotFoundException('The task was not found')
    }

    return this.tasksRepository.delete(id)
  }

  findById(id: string): Promise<Task> {
    return this.tasksRepository.findOneBy({ id: Number(id) })
  }
}
