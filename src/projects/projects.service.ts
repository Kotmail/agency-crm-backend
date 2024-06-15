import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Project } from './project.entity'
import { DeleteResult, Repository } from 'typeorm'
import { CreateProjectDto } from './dto/create-project.dto'
import { User } from 'src/users/user.entity'
import { PaginatedDto } from 'src/shared/dto/paginated.dto'
import { QueryProjectsDto } from './dto/query-projects.dto'
import { UpdateProjectDto } from './dto/update-project.dto'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(authUser: User, projectDto: CreateProjectDto): Promise<Project> {
    const { id } = await this.projectsRepository.save({
      ...projectDto,
      creator: { id: projectDto.creator || authUser.id },
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
    const [items, totalCount] = await this.projectsRepository.findAndCount({
      order: {
        id: 'ASC',
      },
      relations: {
        members: true,
        tasks: {
          responsibleUsers: true,
        },
      },
      take: queryDto.take,
      skip: queryDto.skip,
    })

    return { items, totalCount }
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id: Number(id) },
      relations: {
        creator: true,
        members: true,
        tasks: {
          responsibleUsers: true,
        },
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
