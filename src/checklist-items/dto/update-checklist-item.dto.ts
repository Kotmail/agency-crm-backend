import { PartialType } from '@nestjs/mapped-types'
import { CreateChecklistItemDto } from './create-checklist-item.dto'

export class UpdateChecklistItemDto extends PartialType(
  CreateChecklistItemDto,
) {}
