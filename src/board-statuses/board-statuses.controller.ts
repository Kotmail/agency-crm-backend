import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common'
import { BoardStatusesService } from './board-statuses.service'
import { CreateBoardStatusDto } from './dto/create-board-status.dto'
import { UpdateBoardStatusDto } from './dto/update-board-status.dto'

@Controller('boards/:boardId/statuses')
export class BoardStatusesController {
  constructor(private readonly boardStatusesService: BoardStatusesService) {}

  @Post()
  create(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() statusDto: CreateBoardStatusDto,
  ) {
    return this.boardStatusesService.create(boardId, statusDto)
  }

  @Put(':statusId')
  update(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('statusId', ParseIntPipe) statusId: number,
    @Body() statusDto: UpdateBoardStatusDto,
  ) {
    return this.boardStatusesService.update(boardId, statusId, statusDto)
  }

  @Get()
  getAll(@Param('boardId', ParseIntPipe) boardId: number) {
    return this.boardStatusesService.findAll(boardId)
  }

  @Delete(':statusId')
  delete(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('statusId', ParseIntPipe) statusId: number,
  ) {
    return this.boardStatusesService.delete(boardId, statusId)
  }
}
