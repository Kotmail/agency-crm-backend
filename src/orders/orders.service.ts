import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order, OrderPriority, OrderStatus } from './order.entity'
import { DeleteResult, FindManyOptions, In, Repository } from 'typeorm'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { User, UserRole } from 'src/users/user.entity'
import { QueryOrdersDto } from './dto/query-orders.dto'
import { PaginatedDto } from 'src/shared/dto/paginated.dto'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  create(creatorId: number, orderDto: CreateOrderDto): Promise<Order> {
    return this.ordersRepository.save({
      ...orderDto,
      creator: { id: orderDto.creatorId || creatorId },
      executor: { id: orderDto.executorId },
    })
  }

  async update(
    authUser: User,
    id: string,
    orderDto: UpdateOrderDto,
  ): Promise<Order> {
    const orderData = await this.findById(id)

    if (!orderData) {
      throw new NotFoundException('The order was not found')
    }

    if (authUser.role !== UserRole.ADMIN) {
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
      id: Number(id),
      ...orderDto,
      creator: orderDto.creatorId ? { id: orderDto.creatorId } : undefined,
      executor: orderDto.executorId ? { id: orderDto.executorId } : undefined,
    })

    return await this.findById(id)
  }

  async findAll(
    user: User,
    queryDto: QueryOrdersDto,
  ): Promise<PaginatedDto<Order>> {
    const findOptions: FindManyOptions<Order> = {
      where: {
        priority: In(queryDto.priority || Object.values(OrderPriority)),
        status: In(queryDto.status || Object.values(OrderStatus)),
        isArchived: queryDto.isArchived,
      },
      order: {
        [queryDto.sortBy]: queryDto.orderBy,
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

    const [items, totalCount] =
      await this.ordersRepository.findAndCount(findOptions)

    return { items, totalCount }
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.findById(id)

    if (!order) {
      throw new NotFoundException('The order was not found')
    }

    return order
  }

  async delete(authUser: User, id: string): Promise<DeleteResult> {
    const order = await this.findById(id)

    if (!order) {
      throw new NotFoundException('The order was not found')
    }

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

  findById(id: string): Promise<Order> {
    return this.ordersRepository.findOneBy({ id: Number(id) })
  }
}
