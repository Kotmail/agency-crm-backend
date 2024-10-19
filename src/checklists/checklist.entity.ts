import { ChecklistItem } from 'src/checklist-items/checklist-item.entity'
import { Task } from 'src/tasks/task.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('checklists')
export class Checklist {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Task, (task) => task.id)
  @JoinColumn({ name: 'task_id' })
  task: Task

  @OneToMany(() => ChecklistItem, (checklistItem) => checklistItem.checklist)
  items: ChecklistItem[]
}
