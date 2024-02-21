import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { User } from 'src/users/user.entity'
import { QueryOrdersDto } from './dto/query-orders.dto'

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@CurrentUser() creator: User, @Body() orderDto: CreateOrderDto) {
    return this.ordersService.create(creator.id, orderDto)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() orderDto: UpdateOrderDto) {
    return this.ordersService.update(id, orderDto)
  }

  @Get()
  getAll(@CurrentUser() user: User, @Query() queryDto: QueryOrdersDto) {
    return this.ordersService.findAll(user, queryDto)
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.ordersService.findById(id)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ordersService.delete(id)
  }
}
