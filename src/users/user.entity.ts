import { ApiProperty } from '@nestjs/swagger'
import { Order } from 'src/orders/order.entity'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EXECUTOR = 'executor',
}

@Entity('users')
export class User {
  @ApiProperty({
    example: 1,
    description: 'User ID.',
  })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({
    nullable: true,
    example: 'AllenBwn',
    description: 'Login of user.',
  })
  @Column({ unique: true, nullable: true })
  login: string | null

  @ApiProperty({
    example: 'mail@example.com',
    description: 'E-mail address of user.',
  })
  @Column({ unique: true })
  email: string

  @ApiProperty({
    example: 'Allen',
    description: 'Name of user.',
  })
  @Column({ name: 'first_name' })
  firstName: string

  @ApiProperty({
    example: 'Brown',
    description: 'Surname of user.',
  })
  @Column({ name: 'last_name' })
  lastName: string

  @ApiProperty({
    enum: UserRole,
    default: UserRole.EXECUTOR,
    description: 'Role of user.',
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EXECUTOR,
  })
  role: UserRole

  @Column({ select: false })
  password: string

  @OneToMany(() => Order, (order) => order.creator)
  orders: Order[]
}
