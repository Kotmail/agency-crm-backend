import { ApiProperty } from '@nestjs/swagger'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

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

  @ApiProperty({
    nullable: true,
    example: 'ce2f2bab-d22b-405f-aabd-7dbf3562bbd2.jpeg',
    description: 'Avatar of user.',
  })
  @Column({ nullable: true })
  avatar: string | null

  @Column({ select: false })
  password: string
}
