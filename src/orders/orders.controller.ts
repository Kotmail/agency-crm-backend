import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { Order } from './order.entity'
import { ApiPagintaedResponse } from 'src/shared/decorators/api-paginated-response'

@ApiTags('Orders')
@ApiUnauthorizedResponse({ description: 'Unauthorized user.' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create a new order.' })
  @ApiCreatedResponse({
    type: Order,
    description: 'A new order has been successfully created.',
  })
  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@CurrentUser() creator: User, @Body() orderDto: CreateOrderDto) {
    return this.ordersService.create(creator.id, orderDto)
  }

  @ApiOperation({ summary: 'Update a specific order.' })
  @ApiOkResponse({
    type: Order,
    description: 'The order has been successfully updated.',
  })
  @ApiNotFoundResponse({ description: 'The order was not found.' })
  @ApiForbiddenResponse({ description: 'Permissions error.' })
  @Put(':id')
  update(
    @CurrentUser() authUser: User,
    @Param('id') id: string,
    @Body() orderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(authUser, id, orderDto)
  }

  @ApiOperation({ summary: 'Get all orders.' })
  @ApiPagintaedResponse(Order, {
    description: 'Orders were successfully received.',
  })
  @Get()
  getAll(@CurrentUser() user: User, @Query() queryDto: QueryOrdersDto) {
    return this.ordersService.findAll(user, queryDto)
  }

  @ApiOperation({ summary: 'Get a specific order.' })
  @ApiOkResponse({
    type: Order,
    description: 'The order was successfully received.',
  })
  @ApiNotFoundResponse({ description: 'The order was not found.' })
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.ordersService.findOne(id)
  }

  @ApiOperation({ summary: 'Delete a specific order.' })
  @ApiNoContentResponse({ description: 'The order was successfully deleted.' })
  @ApiNotFoundResponse({ description: 'The order was not found.' })
  @ApiForbiddenResponse({ description: 'Permissions error.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  delete(@CurrentUser() authUser: User, @Param('id') id: string) {
    return this.ordersService.delete(authUser, id)
  }
}
