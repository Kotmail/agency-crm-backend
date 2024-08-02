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

  async create(authUser: User, taskDto: CreateTaskDto): Promise<Task> {
    const { id } = await this.tasksRepository.save({
      ...taskDto,
      creator: { id: taskDto.creatorId || authUser.id },
      project: { id: taskDto.projectId },
      responsibleUsers: taskDto.responsibleUserIds
        ? taskDto.responsibleUserIds.map((userId) => ({ id: userId }))
        : [],
    })

    return await this.tasksRepository.findOne({
      where: { id },
      select: {
        project: {
          id: true,
          name: true,
        },
      },
      relations: {
        creator: true,
        project: true,
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
      creator: taskDto.creatorId ? { id: taskDto.creatorId } : undefined,
      project: taskDto.projectId ? { id: taskDto.projectId } : undefined,
      responsibleUsers: taskDto.responsibleUserIds
        ? taskDto.responsibleUserIds.map((userId) => ({ id: userId }))
        : undefined,
    })

    return await this.tasksRepository.findOne({
      where: { id: Number(id) },
      select: {
        project: {
          id: true,
          name: true,
        },
      },
      relations: {
        creator: true,
        project: true,
        responsibleUsers: true,
      },
    })
  }

  async findAll(queryDto: QueryTasksDto): Promise<PaginatedDto<Task>> {
    const [items, totalCount] = await this.tasksRepository.findAndCount({
      where: {
        project: queryDto.projectId ? { id: queryDto?.projectId } : undefined,
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
      select: {
        project: {
          id: true,
          name: true,
        },
      },
      relations: {
        creator: true,
        project: true,
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
