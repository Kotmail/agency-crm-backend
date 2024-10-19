import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Checklist } from './checklist.entity'
import { DeleteResult, Repository } from 'typeorm'
import { CreateChecklistDto } from './dto/create-checklist.dto'
import { UpdateChecklistDto } from './dto/update-checklist.dto'
import { QueryChecklistsDto } from './dto/query-checklists.dto'

@Injectable()
export class ChecklistsService {
  constructor(
    @InjectRepository(Checklist)
    private checklistsRepository: Repository<Checklist>,
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
      relations: {
        items: dto.includeItems,
      },
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
}
