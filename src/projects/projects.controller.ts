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
import { ProjectsService } from './projects.service'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { UserRole } from 'src/users/user.entity'
import { CreateProjectDto } from './dto/create-project.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { QueryProjectsDto } from './dto/query-projects.dto'
import { UpdateProjectDto } from './dto/update-project.dto'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() projectDto: CreateProjectDto) {
    return this.projectsService.create(projectDto)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() projectDto: UpdateProjectDto) {
    return this.projectsService.update(id, projectDto)
  }

  @Get()
  getAll(@Query() queryDto: QueryProjectsDto) {
    return this.projectsService.findAll(queryDto)
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.projectsService.findOne(id)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  delete(@Param('id') id: string) {
    return this.projectsService.delete(id)
  }
}
