import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Checklist } from './checklist.entity'
import { DeleteResult, Repository } from 'typeorm'
import { CreateChecklistDto } from './dto/create-checklist.dto'
import { UpdateChecklistDto } from './dto/update-checklist.dto'
import { QueryChecklistsDto } from './dto/query-checklists.dto'
import { ChecklistItemsService } from 'src/checklist-items/checklist-items.service'
import { CreateChecklistItemDto } from 'src/checklist-items/dto/create-checklist-item.dto'
import { ChecklistItem } from 'src/checklist-items/checklist-item.entity'
import { UpdateChecklistItemDto } from 'src/checklist-items/dto/update-checklist-item.dto'

@Injectable()
export class ChecklistsService {
  constructor(
    @InjectRepository(Checklist)
    private checklistsRepository: Repository<Checklist>,
    private checklistItemsService: ChecklistItemsService,
  ) {}

  async create(dto: CreateChecklistDto) {
    const { id } = await this.checklistsRepository.save({
      ...dto,
      task: { id: dto.taskId },
    })

    return await this.checklistsRepository.findOneBy({
      id,
    })
  }

  async update(id: string, dto: UpdateChecklistDto): Promise<Checklist> {
    const checklist = await this.checklistsRepository.findOneBy({
      id: Number(id),
    })

    if (!checklist) {
      throw new NotFoundException('The checklist was not found')
    }

    await this.checklistsRepository.save({
      id: Number(id),
      ...dto,
    })

    return await this.checklistsRepository.findOne({
      where: { id: Number(id) },
    })
  }

  findAll(dto: QueryChecklistsDto): Promise<Checklist[]> {
    return this.checklistsRepository.find({
      where: { task: { id: dto.taskId } },
      order: { id: 'ASC' },
    })
  }

  async delete(id: string): Promise<DeleteResult> {
    const checklist = await this.checklistsRepository.findOneBy({
      id: Number(id),
    })

    if (!checklist) {
      throw new NotFoundException('The checklist was not found')
    }

    return this.checklistsRepository.delete(id)
  }

  // Child items.

  async createChildItem(
    checklistId: string,
    dto: CreateChecklistItemDto,
  ): Promise<ChecklistItem> {
    const checklist = await this.checklistsRepository.findOneBy({
      id: Number(checklistId),
    })

    if (!checklist) {
      throw new NotFoundException('The checklist was not found')
    }

    return this.checklistItemsService.create(checklistId, dto)
  }

  async getChildItems(checklistId: string): Promise<ChecklistItem[]> {
    const checklist = await this.checklistsRepository.findOneBy({
      id: Number(checklistId),
    })

    if (!checklist) {
      throw new NotFoundException('The checklist was not found')
    }

    return this.checklistItemsService.getAll(checklistId)
  }

  async updateChildItem(
    checklistId: string,
    itemId: string,
    dto: UpdateChecklistItemDto,
  ) {
    const checklist = await this.checklistsRepository.findOneBy({
      id: Number(checklistId),
    })

    if (!checklist) {
      throw new NotFoundException('The checklist was not found')
    }

    return this.checklistItemsService.update(itemId, dto)
  }

  async deleteChildItem(
    checklistId: string,
    itemId: string,
  ): Promise<DeleteResult> {
    const checklist = await this.checklistsRepository.findOneBy({
      id: Number(checklistId),
    })

    if (!checklist) {
      throw new NotFoundException('The checklist was not found')
    }

    return this.checklistItemsService.delete(itemId)
  }
}
