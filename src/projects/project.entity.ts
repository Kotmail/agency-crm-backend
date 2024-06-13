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

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'creator_id' })
  creator: User

  @ManyToMany(() => User, { eager: true })
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
