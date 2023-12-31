import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { OrderService } from './order.service'
import { CreateOrderDto } from './create-order.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UpdateOrderDto } from './update-order.dto'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { User } from 'src/user/user.entity'

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@CurrentUser() creator: User, @Body() orderDto: CreateOrderDto) {
    return this.orderService.create(creator.id, orderDto)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() orderDto: UpdateOrderDto) {
    return this.orderService.update(id, orderDto)
  }

  @Get()
  getAll() {
    return this.orderService.findAll()
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.orderService.findById(id)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.orderService.delete(id)
  }
}
