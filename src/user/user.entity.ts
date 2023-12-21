import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  INSTALLER = 'installer',
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
    default: UserRole.INSTALLER,
  })
  role: UserRole

  @Column({ select: false })
  password: string
}
