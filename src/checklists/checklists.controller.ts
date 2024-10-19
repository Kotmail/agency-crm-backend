import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ChecklistsService } from './checklists.service'
import { CreateChecklistDto } from './dto/create-checklist.dto'
import { UpdateChecklistDto } from './dto/update-checklist.dto'
import { QueryChecklistsDto } from './dto/query-checklists.dto'
import { ChecklistItemsService } from 'src/checklist-items/checklist-items.service'
import { CreateChecklistItemDto } from 'src/checklist-items/dto/create-checklist-item.dto'
import { UpdateChecklistItemDto } from 'src/checklist-items/dto/update-checklist-item.dto'

@Controller('checklists')
export class ChecklistsController {
  constructor(
    private readonly checklistsService: ChecklistsService,
    private readonly checklistItemsService: ChecklistItemsService,
  ) {}

  @Post()
  create(@Body() dto: CreateChecklistDto) {
    return this.checklistsService.create(dto)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChecklistDto) {
    return this.checklistsService.update(id, dto)
  }

  @Get()
  getAll(@Query() dto: QueryChecklistsDto) {
    return this.checklistsService.findAll(dto)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.checklistsService.delete(id)
  }

  // Items.

  @Post(':id/items')
  createItem(@Param('id') id: string, @Body() dto: CreateChecklistItemDto) {
    return this.checklistItemsService.create(id, dto)
  }

  @Put(':id/items/:itemId')
  updateItem(@Param('itemId') id: string, @Body() dto: UpdateChecklistItemDto) {
    return this.checklistItemsService.update(id, dto)
  }

  @Delete(':id/items/:itemId')
  deleteItem(@Param('itemId') id: string) {
    return this.checklistItemsService.delete(id)
  }
}
