import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from './order.entity'
import { DeleteResult, FindManyOptions, Repository } from 'typeorm'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { User, UserRole } from 'src/users/user.entity'
import { QueryOrdersDto } from './dto/query-orders.dto'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(creatorId: number, orderDto: CreateOrderDto): Promise<Order> {
    const { id } = await this.ordersRepository.save({
      ...orderDto,
      creator: { id: orderDto.creatorId || creatorId },
      executor: { id: orderDto.executorId },
    })

    return await this.ordersRepository.findOneBy({ id })
  }

  async update(id: string, orderDto: UpdateOrderDto): Promise<Order> {
    const orderId = Number(id)

    await this.ordersRepository.save({
      id: orderId,
      ...orderDto,
      creator: orderDto.creatorId ? { id: orderDto.creatorId } : undefined,
      executor: orderDto.executorId ? { id: orderDto.executorId } : undefined,
    })

    return await this.ordersRepository.findOneBy({ id: orderId })
  }

  findAll(user: User, queryDto: QueryOrdersDto): Promise<Order[]> {
    const findOptions: FindManyOptions<Order> = {
      where: {
        isArchived: queryDto.state === 'closed' ? true : false,
      },
      order: {
        createdAt: 'DESC',
      },
    }

    if (user.role !== UserRole.ADMIN) {
      const { id } = user
      const relationColumnName =
        user.role === UserRole.MANAGER ? 'creator' : 'executor'

      findOptions.where[relationColumnName] = {
        id,
      }
    }

    return this.ordersRepository.find(findOptions)
  }

  findById(id: string): Promise<Order> {
    return this.ordersRepository.findOneBy({ id: Number(id) })
  }

  delete(id: string): Promise<DeleteResult> {
    return this.ordersRepository.delete(id)
  }
}
