import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Project } from './project.entity'
import { DeleteResult, Repository } from 'typeorm'
import { CreateProjectDto } from './dto/create-project.dto'
import { PaginatedDto } from 'src/shared/dto/paginated.dto'
import { QueryProjectsDto } from './dto/query-projects.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { TaskStatus } from 'src/tasks/task.entity'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(projectDto: CreateProjectDto): Promise<Project> {
    const { id } = await this.projectsRepository.save({
      ...projectDto,
      creator: { id: projectDto.creator },
      members: projectDto.members
        ? projectDto.members.map((userId) => ({ id: userId }))
        : [],
    })

    return await this.projectsRepository.findOne({
      where: { id },
      relations: {
        creator: true,
        members: true,
        tasks: {
          responsibleUsers: true,
        },
      },
    })
  }

  async update(id: string, projectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectsRepository.findOneBy({ id: Number(id) })

    if (!project) {
      throw new NotFoundException('The project was not found')
    }

    await this.projectsRepository.save({
      id: Number(id),
      ...projectDto,
      creator: projectDto.creator ? { id: projectDto.creator } : undefined,
      members: projectDto.members
        ? projectDto.members.map((userId) => ({ id: userId }))
        : undefined,
    })

    return await this.projectsRepository.findOne({
      where: { id: Number(id) },
      relations: {
        creator: true,
        members: true,
        tasks: {
          responsibleUsers: true,
        },
      },
    })
  }

  async findAll(queryDto: QueryProjectsDto): Promise<PaginatedDto<Project>> {
    const [items, totalCount] = await this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.creator', 'creator')
      .leftJoinAndSelect('project.members', 'members')
      .loadRelationCountAndMap('project.taskTotal', 'project.tasks')
      .loadRelationCountAndMap(
        'project.taskCompleted',
        'project.tasks',
        'task',
        (qb) =>
          qb.where('task.status = :status', {
            status: TaskStatus.COMPLETED,
          }),
      )
      .orderBy('project.createdAt', 'DESC')
      .take(queryDto.take)
      .skip(queryDto.skip)
      .getManyAndCount()

    return { items, totalCount }
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id: Number(id) },
      relations: {
        creator: true,
        members: true,
      },
    })

    if (!project) {
      throw new NotFoundException('The project was not found')
    }

    return project
  }

  async delete(id: string): Promise<DeleteResult> {
    const project = await this.projectsRepository.findOneBy({ id: Number(id) })

    if (!project) {
      throw new NotFoundException('The project was not found')
    }

    return this.projectsRepository.delete(id)
  }
}
