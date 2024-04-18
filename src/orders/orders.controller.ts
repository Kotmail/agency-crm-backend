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
import { User, UserRole } from 'src/users/user.entity'
import { QueryOrdersDto } from './dto/query-orders.dto'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
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
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  delete(@CurrentUser() authUser: User, @Param('id') id: string) {
    return this.ordersService.delete(authUser, id)
  }
}
