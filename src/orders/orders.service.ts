import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order, OrderPriority, OrderStatus } from './order.entity'
import { DeleteResult, FindManyOptions, In, Repository } from 'typeorm'
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

    return await this.findById(id)
  }

  async update(
    authUser: User,
    id: number,
    orderDto: UpdateOrderDto,
  ): Promise<Order> {
    if (authUser.role !== UserRole.ADMIN) {
      const orderData = await this.findById(id)
      const orderRelationUserIds = [orderData.creator.id, orderData.executor.id]

      if (!orderRelationUserIds.includes(authUser.id)) {
        throw new ForbiddenException(
          `You are not authorized to update an order with ID ${id}`,
        )
      }

      if (authUser.role === UserRole.EXECUTOR) {
        Object.keys(orderDto).forEach(
          (key) => key !== 'status' && delete orderDto[key],
        )
      }
    }

    await this.ordersRepository.save({
      id,
      ...orderDto,
      creator: orderDto.creatorId ? { id: orderDto.creatorId } : undefined,
      executor: orderDto.executorId ? { id: orderDto.executorId } : undefined,
    })

    return await this.findById(id)
  }

  findAll(user: User, queryDto: QueryOrdersDto): Promise<[Order[], number]> {
    const findOptions: FindManyOptions<Order> = {
      where: {
        priority: In(queryDto.priority || Object.values(OrderPriority)),
        status: In(queryDto.status || Object.values(OrderStatus)),
        isArchived: queryDto.isArchived,
      },
      order: {
        [queryDto.sortby]: queryDto.orderby,
      },
      take: queryDto.take,
      skip: queryDto.skip,
    }

    if (user.role !== UserRole.ADMIN) {
      const { id } = user
      const relationColumnName =
        user.role === UserRole.MANAGER ? 'creator' : 'executor'

      findOptions.where[relationColumnName] = {
        id,
      }
    }

    return this.ordersRepository.findAndCount(findOptions)
  }

  findById(id: number): Promise<Order> {
    return this.ordersRepository.findOneBy({ id })
  }

  async delete(authUser: User, id: number): Promise<DeleteResult> {
    if (authUser.role !== UserRole.ADMIN) {
      const orderData = await this.findById(id)

      if (orderData && orderData.creator.id !== authUser.id) {
        throw new ForbiddenException(
          `You are not authorized to delete an order with ID ${id}`,
        )
      }
    }

    return this.ordersRepository.delete(id)
  }
}
