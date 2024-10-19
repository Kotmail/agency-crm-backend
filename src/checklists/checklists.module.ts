import { Module } from '@nestjs/common'
import { ChecklistsService } from './checklists.service'
import { ChecklistsController } from './checklists.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Checklist } from './checklist.entity'
import { ChecklistItemsModule } from 'src/checklist-items/checklist-items.module'

@Module({
  imports: [ChecklistItemsModule, TypeOrmModule.forFeature([Checklist])],
  controllers: [ChecklistsController],
  providers: [ChecklistsService],
})
export class ChecklistsModule {}
