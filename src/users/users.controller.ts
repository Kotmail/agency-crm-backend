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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ApiPagintaedResponse } from 'src/shared/decorators/api-paginated-response'

@ApiTags('Users')
@ApiBearerAuth('Auth')
@ApiUnauthorizedResponse({ description: 'Unauthorized user.' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user.' })
  @ApiCreatedResponse({
    type: User,
    description: 'A new user has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
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
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiNotFoundResponse({ description: 'The user was not found.' })
  @ApiForbiddenResponse({ description: 'Permissions error.' })
  @Put(':id')
  update(
    @CurrentUser() authUser: User,
    @Param('id') id: string,
    @Body() userDto: UpdateUserDto,
  ) {
    return this.usersService.update(authUser, Number(id), userDto)
  }

  @ApiOperation({ summary: 'Get all users.' })
  @ApiPagintaedResponse(User, {
    description: 'Users were successfully received.',
  })
  @Get()
  getAll(@CurrentUser() authUser: User, @Query() queryDto: QueryUsersDto) {
    return this.usersService.findAll(authUser, queryDto)
  }

  @ApiOperation({ summary: 'Get a specific user.' })
  @ApiOkResponse({
    type: User,
    description: 'The user was successfully received.',
  })
  @ApiNotFoundResponse({ description: 'The user was not found.' })
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @ApiOperation({ summary: 'Delete a specific user.' })
  @ApiNoContentResponse({ description: 'The user was successfully deleted.' })
  @ApiNotFoundResponse({ description: 'The user was not found.' })
  @ApiForbiddenResponse({ description: 'Permissions error.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  delete(@CurrentUser() authUser: User, @Param('id') id: string) {
    return this.usersService.delete(authUser, id)
  }
}
