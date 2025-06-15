import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BoardStatus } from './board-status.entity'
import { DeleteResult, Repository } from 'typeorm'
import { CreateBoardStatusDto } from './dto/create-board-status.dto'
import { UpdateBoardStatusDto } from './dto/update-board-status.dto'

@Injectable()
export class BoardStatusesService {
  constructor(
    @InjectRepository(BoardStatus)
    private boardStatusesRepository: Repository<BoardStatus>,
  ) {}

  async create(
    boardId: number,
    statusDto: CreateBoardStatusDto,
  ): Promise<BoardStatus> {
    const { id } = await this.boardStatusesRepository.save({
      ...statusDto,
      board: { id: boardId },
    })

    return await this.boardStatusesRepository.findOne({
      where: { id },
    })
  }

  async update(
    boardId: number,
    statusId: number,
    statusDto: UpdateBoardStatusDto,
  ): Promise<BoardStatus> {
    try {
      await this.boardStatusesRepository.findOneByOrFail({
        id: statusId,
        board: { id: boardId },
      })

      await this.boardStatusesRepository.save({
        id: statusId,
        ...statusDto,
        board: statusDto.board ? { id: statusDto.board } : undefined,
      })

      return await this.boardStatusesRepository.findOne({
        where: { id: statusId },
      })
    } catch {
      throw new NotFoundException(
        `The board or status with the specified IDs (${boardId}, ${statusId}) does not exist`,
      )
    }
  }

  async findAll(boardId: number): Promise<BoardStatus[]> {
    return await this.boardStatusesRepository.find({
      where: { board: { id: boardId } },
      order: { id: 'ASC' },
    })
  }

  async delete(boardId: number, statusId: number): Promise<DeleteResult> {
    try {
      await this.boardStatusesRepository.findOneByOrFail({
        id: statusId,
        board: { id: boardId },
      })

      return await this.boardStatusesRepository.delete(statusId)
    } catch {
      throw new NotFoundException(
        `The board or status with the specified IDs (${boardId}, ${statusId}) does not exist`,
      )
    }
  }
}
