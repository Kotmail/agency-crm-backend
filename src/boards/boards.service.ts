import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Board } from './board.entity'
import { DeleteResult, Repository } from 'typeorm'
import { CreateBoardDto } from './dto/create-board.dto'
import { BoardStatus } from 'src/board-statuses/board-status.entity'
import { QueryBoardsDto } from './dto/query-boards.dto'
import { PaginatedDto } from 'src/shared/dto/paginated.dto'
import { UpdateBoardDto } from './dto/update-board.dto'

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
  ) {}

  async create(boardDto: CreateBoardDto): Promise<Board> {
    const boardStatus = new BoardStatus()
    boardStatus.name = 'board_status_default_name'

    const { id } = await this.boardsRepository.save({
      ...boardDto,
      project: { id: boardDto.project },
      statuses: [boardStatus],
    })

    return await this.boardsRepository.findOne({
      where: { id },
    })
  }

  async update(id: number, boardDto: UpdateBoardDto): Promise<Board> {
    try {
      await this.boardsRepository.findOneByOrFail({ id })

      await this.boardsRepository.save({
        id,
        ...boardDto,
        project: boardDto.project ? { id: boardDto.project } : undefined,
      })

      return await this.boardsRepository.findOne({
        where: { id },
      })
    } catch {
      throw new NotFoundException(`The board with ID ${id} does not exist`)
    }
  }

  async findAll(queryDto: QueryBoardsDto): Promise<PaginatedDto<Board>> {
    const [items, totalCount] = await this.boardsRepository.findAndCount({
      where: queryDto.projectId
        ? { project: { id: queryDto.projectId } }
        : undefined,
      order: { id: 'ASC' },
      relations: queryDto.includeStatuses ? { statuses: true } : undefined,
      take: queryDto.take,
      skip: queryDto.skip,
    })

    return { items, totalCount }
  }

  async findOne(id: number): Promise<Board> {
    try {
      return await this.boardsRepository.findOneOrFail({
        where: { id },
        relations: {
          statuses: true,
        },
      })
    } catch {
      throw new NotFoundException(`The board with ID ${id} does not exist`)
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    try {
      await this.boardsRepository.findOneByOrFail({ id })

      return await this.boardsRepository.delete(id)
    } catch {
      throw new NotFoundException(`The board with ID ${id} does not exist`)
    }
  }
}
