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
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { User, UserRole } from './user.entity'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { QueryUsersDto } from './dto/query-users.dto'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user.' })
  @ApiCreatedResponse({
    type: User,
    description: 'A new user has been successfully created.',
  })
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto)
  }

  @ApiOperation({ summary: 'Update a specific user.' })
  @ApiOkResponse({
    type: User,
    description: 'The user has been successfully updated.',
  })
  @Put(':id')
  update(
    @CurrentUser() authUser: User,
    @Param('id') id: string,
    @Body() userDto: UpdateUserDto,
  ) {
    return this.usersService.update(authUser, Number(id), userDto)
  }

  @Get()
  getAll(@CurrentUser() authUser: User, @Query() queryDto: QueryUsersDto) {
    return this.usersService.findAll(authUser, queryDto)
  }

  @ApiOperation({ summary: 'Get a specific user.' })
  @ApiOkResponse({
    type: User,
    description: 'The user was successfully received.',
  })
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
