import { Checklist } from 'src/checklists/checklist.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('checklist_items')
export class ChecklistItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    type: 'boolean',
    name: 'is_done',
    default: false,
  })
  isDone: boolean = false

  @ManyToOne(() => Checklist, (checklist) => checklist.items)
  @JoinColumn({ name: 'checklist_id' })
  checklist: Checklist
}
