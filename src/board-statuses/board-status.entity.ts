import { Board } from 'src/boards/board.entity'
import { Task } from 'src/tasks/task.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('board_statuses')
export class BoardStatus {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Board, (board) => board.statuses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board_id' })
  board: Board

  @OneToMany(() => Task, (task) => task.boardStatus)
  tasks: Task[]
}
