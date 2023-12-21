import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './create-user.dto'
import { UpdateUserDto } from './update-user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() userDto: UpdateUserDto) {
    return this.userService.update(Number(id), userDto)
  }

  @Get()
  getAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.userService.findById(id)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id)
  }
}
