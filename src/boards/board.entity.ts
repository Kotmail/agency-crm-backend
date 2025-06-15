import { BoardStatus } from 'src/board-statuses/board-status.entity'
import { Project } from 'src/projects/project.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @OneToMany(() => BoardStatus, (boardStatus) => boardStatus.board, {
    cascade: ['insert'],
  })
  statuses: BoardStatus[]

  @ManyToOne(() => Project, (project) => project.boards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project
}
