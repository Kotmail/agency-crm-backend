import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { BoardsService } from './boards.service'
import { CreateBoardDto } from './dto/create-board.dto'
import { QueryBoardsDto } from './dto/query-boards.dto'
import { UpdateBoardDto } from './dto/update-board.dto'

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  create(@Body() boardDto: CreateBoardDto) {
    return this.boardsService.create(boardDto)
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() boardDto: UpdateBoardDto,
  ) {
    return this.boardsService.update(id, boardDto)
  }

  @Get()
  getAll(@Query() dto: QueryBoardsDto) {
    return this.boardsService.findAll(dto)
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.boardsService.findOne(id)
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.boardsService.delete(id)
  }
}
