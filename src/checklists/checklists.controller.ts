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
import { CreateChecklistItemDto } from 'src/checklist-items/dto/create-checklist-item.dto'
import { UpdateChecklistItemDto } from 'src/checklist-items/dto/update-checklist-item.dto'

@Controller('checklists')
export class ChecklistsController {
  constructor(private readonly checklistsService: ChecklistsService) {}

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

  // Child items.

  @Post(':id/items')
  createChildItem(
    @Param('id') id: string,
    @Body() dto: CreateChecklistItemDto,
  ) {
    return this.checklistsService.createChildItem(id, dto)
  }

  @Get(':id/items')
  getChildItems(@Param('id') id: string) {
    return this.checklistsService.getChildItems(id)
  }

  @Put(':id/items/:itemId')
  updateChildItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateChecklistItemDto,
  ) {
    return this.checklistsService.updateChildItem(id, itemId, dto)
  }

  @Delete(':id/items/:itemId')
  deleteChildItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.checklistsService.deleteChildItem(id, itemId)
  }
}
