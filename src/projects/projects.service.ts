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

  create(authUser: User, projectDto: CreateProjectDto): Promise<Project> {
    return this.projectsRepository.save({
      ...projectDto,
      creator: { id: projectDto.creator || authUser.id },
      members: projectDto.members
        ? projectDto.members.map((userId) => ({ id: userId }))
        : [],
    })
  }

  async update(id: string, projectDto: UpdateProjectDto): Promise<Project> {
    const projectData = await this.findById(id)

    if (!projectData) {
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

    return await this.findById(id)
  }

  async findAll(queryDto: QueryProjectsDto): Promise<PaginatedDto<Project>> {
    const [items, totalCount] = await this.projectsRepository.findAndCount({
      order: {
        id: 'ASC',
      },
      take: queryDto.take,
      skip: queryDto.skip,
    })

    return { items, totalCount }
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.findById(id)

    if (!project) {
      throw new NotFoundException('The project was not found')
    }

    return project
  }

  async delete(id: string): Promise<DeleteResult> {
    const project = await this.findById(id)

    if (!project) {
      throw new NotFoundException('The project was not found')
    }

    return this.projectsRepository.delete(id)
  }

  findById(id: string): Promise<Project> {
    return this.projectsRepository.findOneBy({ id: Number(id) })
  }
}
