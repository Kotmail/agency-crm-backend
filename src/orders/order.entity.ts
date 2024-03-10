import { User } from 'src/users/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum OrderPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum OrderStatus {
  WAITING = 'waiting',
  ACCEPTED = 'accepted',
  DONE = 'done',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'text',
  })
  description: string

  @Column({
    type: 'text',
    name: 'object_address',
  })
  objectAddress: string

  @Column()
  brand: string

  @Column({
    type: 'int',
  })
  cost: number

  @ManyToOne(() => User, (user) => user.orders, {
    eager: true,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
  })
  @JoinColumn({ name: 'executor_id' })
  executor: User

  @Column({
    type: 'enum',
    enum: OrderPriority,
    default: OrderPriority.LOW,
  })
  priority: OrderPriority

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.WAITING,
  })
  status: OrderStatus

  @Column({
    type: 'date',
  })
  deadline: Date

  @Column({
    type: 'boolean',
    name: 'is_archived',
    default: false,
  })
  isArchived: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
