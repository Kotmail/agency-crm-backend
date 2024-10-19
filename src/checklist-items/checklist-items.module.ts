import { Module } from '@nestjs/common'
import { ChecklistItemsService } from './checklist-items.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChecklistItem } from './checklist-item.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistItem])],
  exports: [ChecklistItemsService],
  providers: [ChecklistItemsService],
})
export class ChecklistItemsModule {}
