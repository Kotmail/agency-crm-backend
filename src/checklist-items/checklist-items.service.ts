import { Injectable, NotFoundException } from '@nestjs/common'
import { ChecklistItem } from './checklist-item.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository } from 'typeorm'
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto'
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto'

@Injectable()
export class ChecklistItemsService {
  constructor(
    @InjectRepository(ChecklistItem)
    private checklistItemsRepository: Repository<ChecklistItem>,
  ) {}

  async create(
    checklistId: string,
    dto: CreateChecklistItemDto,
  ): Promise<ChecklistItem> {
    const { id } = await this.checklistItemsRepository.save({
      ...dto,
      checklist: { id: Number(checklistId) },
    })

    return await this.checklistItemsRepository.findOneBy({
      id,
    })
  }

  async update(
    id: string,
    dto: UpdateChecklistItemDto,
  ): Promise<ChecklistItem> {
    const checklistItem = await this.checklistItemsRepository.findOneBy({
      id: Number(id),
    })

    if (!checklistItem) {
      throw new NotFoundException('The specified item was not found')
    }

    await this.checklistItemsRepository.save({
      id: Number(id),
      ...dto,
    })

    return await this.checklistItemsRepository.findOne({
      where: { id: Number(id) },
    })
  }

  async delete(id: string): Promise<DeleteResult> {
    const checklistItem = await this.checklistItemsRepository.findOneBy({
      id: Number(id),
    })

    if (!checklistItem) {
      throw new NotFoundException('The specified item was not found')
    }

    return this.checklistItemsRepository.delete(id)
  }
}
