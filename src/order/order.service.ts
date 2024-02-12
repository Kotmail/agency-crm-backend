import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from './order.entity'
import { DeleteResult, Repository } from 'typeorm'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(creatorId: number, orderDto: CreateOrderDto): Promise<Order> {
    const { id } = await this.orderRepository.save({
      ...orderDto,
      creator: { id: orderDto.creatorId || creatorId },
      executor: { id: orderDto.executorId },
    })

    return await this.orderRepository.findOneBy({ id })
  }

  async update(id: string, orderDto: UpdateOrderDto): Promise<Order> {
    const orderId = Number(id)

    await this.orderRepository.save({
      id: orderId,
      ...orderDto,
      creator: orderDto.creatorId ? { id: orderDto.creatorId } : undefined,
      executor: orderDto.executorId ? { id: orderDto.executorId } : undefined,
    })

    return await this.orderRepository.findOneBy({ id: orderId })
  }

  findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      order: {
        createdAt: 'DESC',
      },
    })
  }

  findById(id: string): Promise<Order> {
    return this.orderRepository.findOneBy({ id: Number(id) })
  }

  delete(id: string): Promise<DeleteResult> {
    return this.orderRepository.delete(id)
  }
}
