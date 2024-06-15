import { Project } from 'src/projects/project.entity'
import { PriorityEnum } from 'src/shared/enums/priority.enum'
import { User } from 'src/users/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum TaskStatus {
  UNSORTED = 'unsorted',
  IN_PROGRESS = 'in-progress',
  IN_REVIEW = 'in-review',
  COMPLETED = 'completed',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string | null

  @Column({
    type: 'date',
    name: 'due_date',
    nullable: true,
  })
  dueDate: Date | null

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.UNSORTED,
  })
  status: TaskStatus

  @Column({
    type: 'enum',
    enum: PriorityEnum,
    nullable: true,
  })
  priority: PriorityEnum | null

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'creator_id' })
  creator: User

  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: 'project_id' })
  project: Project

  @ManyToMany(() => User)
  @JoinTable({
    name: 'tasks_responsible_users',
    joinColumn: {
      name: 'task_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  responsibleUsers: User[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
