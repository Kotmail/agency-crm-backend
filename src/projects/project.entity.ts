import { PriorityEnum } from 'src/shared/enums/priority.enum'
import { Task } from 'src/tasks/task.entity'
import { User } from 'src/users/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string

  @Column({
    type: 'timestamp',
    name: 'due_date',
    nullable: true,
  })
  dueDate: Date | null

  @Column({
    type: 'enum',
    enum: PriorityEnum,
    nullable: true,
  })
  priority: PriorityEnum | null

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'creator_id' })
  creator: User

  @ManyToMany(() => User)
  @JoinTable({
    name: 'projects_members',
    joinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  members: User[]

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  taskTotal?: number

  taskCompleted?: number
}
