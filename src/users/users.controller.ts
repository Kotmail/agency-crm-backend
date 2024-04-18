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
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { User, UserRole } from './user.entity'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto)
  }

  @Put(':id')
  update(
    @CurrentUser() authUser: User,
    @Param('id') id: string,
    @Body() userDto: UpdateUserDto,
  ) {
    return this.usersService.update(authUser, Number(id), userDto)
  }

  @Get()
  getAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.usersService.findById(id)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  delete(@CurrentUser() authUser: User, @Param('id') id: string) {
    return this.usersService.delete(authUser, id)
  }
}
