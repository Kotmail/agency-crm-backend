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
import { TasksService } from './tasks.service'
import { QueryTasksDto } from './dto/query-tasks.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { User, UserRole } from 'src/users/user.entity'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@CurrentUser() authUser: User, @Body() taskDto: CreateTaskDto) {
    return this.tasksService.create(authUser, taskDto)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() taskDto: UpdateTaskDto) {
    return this.tasksService.update(id, taskDto)
  }

  @Get()
  getAll(@Query() queryDto: QueryTasksDto) {
    return this.tasksService.findAll(queryDto)
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.tasksService.findOne(id)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id)
  }
}
