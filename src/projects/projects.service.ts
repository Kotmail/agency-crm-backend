import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository } from 'typeorm'
import { Project } from './project.entity'
import { Board } from 'src/boards/board.entity'
import { BoardStatus } from 'src/board-statuses/board-status.entity'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { QueryProjectsDto } from './dto/query-projects.dto'
import { PaginatedDto } from 'src/shared/dto/paginated.dto'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(projectDto: CreateProjectDto): Promise<Project> {
    const boardStatus = new BoardStatus()
    boardStatus.name = 'board_status_default_name'

    const board = new Board()
    board.name = 'board_default_name'
    board.statuses = [boardStatus]

    const { id } = await this.projectsRepository.save({
      ...projectDto,
      creator: { id: projectDto.creator },
      members: projectDto.members
        ? projectDto.members.map((userId) => ({ id: userId }))
        : [],
      boards: [board],
    })

    return await this.projectsRepository.findOne({
      where: { id },
      relations: {
        creator: true,
        members: true,
      },
    })
  }

  async update(id: number, projectDto: UpdateProjectDto): Promise<Project> {
    try {
      await this.projectsRepository.findOneByOrFail({ id })

      await this.projectsRepository.save({
        id,
        ...projectDto,
        creator: projectDto.creator ? { id: projectDto.creator } : undefined,
        members: projectDto.members
          ? projectDto.members.map((userId) => ({ id: userId }))
          : undefined,
      })

      return await this.projectsRepository.findOne({
        where: { id },
        relations: {
          creator: true,
          members: true,
        },
      })
    } catch {
      throw new NotFoundException(`The project with ID ${id} does not exist`)
    }
  }

  async findAll(queryDto: QueryProjectsDto): Promise<PaginatedDto<Project>> {
    const [items, totalCount] = await this.projectsRepository.findAndCount({
      relations: {
        creator: true,
        members: true,
      },
      order: { createdAt: 'DESC' },
      take: queryDto.take,
      skip: queryDto.skip,
    })

    return { items, totalCount }
  }

  async findOne(id: number): Promise<Project> {
    try {
      return await this.projectsRepository.findOneOrFail({
        where: { id },
        relations: {
          creator: true,
          members: true,
        },
      })
    } catch {
      throw new NotFoundException(`The project with ID ${id} does not exist`)
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    try {
      await this.projectsRepository.findOneByOrFail({ id })

      return await this.projectsRepository.delete(id)
    } catch {
      throw new NotFoundException(`The project with ID ${id} does not exist`)
    }
  }
}
