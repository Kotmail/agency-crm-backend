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
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({
    nullable: true,
  })
  @Column({ unique: true, nullable: true })
  login: string | null

  @ApiProperty()
  @Column({ unique: true })
  email: string

  @ApiProperty()
  @Column({ name: 'full_name' })
  fullName: string

  @ApiProperty({
    enum: UserRole,
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
