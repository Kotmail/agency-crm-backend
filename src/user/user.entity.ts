import { Order } from 'src/order/order.entity'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EXECUTOR = 'executor',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true, nullable: true })
  login: string

  @Column({ unique: true })
  email: string

  @Column({ name: 'full_name' })
  fullName: string

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
