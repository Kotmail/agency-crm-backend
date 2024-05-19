import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
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
  @ApiProperty({
    example: 1,
    description: 'Order ID.',
  })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetur...',
    description: 'Description of order.',
  })
  @Column({
    type: 'text',
  })
  description: string

  @ApiProperty({
    example: '3393 Ronny Way Apt. 742',
    description: 'Address of object.',
  })
  @Column({
    type: 'text',
    name: 'object_address',
    nullable: true,
  })
  objectAddress: string | null

  @ApiProperty({
    example: 'Brand',
    description: 'Brand of order.',
  })
  @Column()
  brand: string

  @ApiProperty({
    example: 1000,
    description: 'Cost of order.',
  })
  @Column({
    type: 'int',
  })
  cost: number

  @ApiProperty({
    type: () => User,
    description: 'Manager of order.',
  })
  @ManyToOne(() => User, (user) => user.orders, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User

  @ApiProperty({
    type: () => User,
    description: 'Executor of order.',
  })
  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'executor_id' })
  executor: User

  @ApiProperty({
    enum: OrderPriority,
    default: OrderPriority.LOW,
    description: 'Priority of order.',
  })
  @Column({
    type: 'enum',
    enum: OrderPriority,
    default: OrderPriority.LOW,
  })
  priority: OrderPriority

  @ApiPropertyOptional({
    enum: OrderStatus,
    default: OrderStatus.WAITING,
    description: 'Status of order.',
  })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.WAITING,
  })
  status: OrderStatus

  @ApiProperty({
    description: 'Deadline of order.',
  })
  @Column({
    type: 'date',
  })
  deadline: Date

  @ApiPropertyOptional({
    default: false,
    description: 'Is the order in the archive.',
  })
  @Column({
    type: 'boolean',
    name: 'is_archived',
    default: false,
  })
  isArchived: boolean

  @ApiProperty({
    description: 'Order creation date.',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
