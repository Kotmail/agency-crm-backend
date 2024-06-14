import { Project } from 'src/projects/project.entity'
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

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

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
    enum: TaskPriority,
    nullable: true,
  })
  priority: TaskPriority | null

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'creator_id' })
  creator: User

  @ManyToOne(() => Project, (project) => project.id, { eager: true })
  @JoinColumn({ name: 'project_id' })
  project: Project

  @ManyToMany(() => User, { eager: true })
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
