import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger'
import { ApiPagintaedResponse } from 'src/shared/decorators/api-paginated-response'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { FileInterceptor } from '@nestjs/platform-express'
import { checkFileType } from 'src/shared/helpers/checkFileType'
import { MimeTypes } from 'src/shared/enums/mime-types.enum'
import { diskStorage } from 'multer'
import { v4 } from 'uuid'
import { extension } from 'mime-types'
import { mkdirSync } from 'fs'

const avatarInterceptorOptions: MulterOptions = {
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (_, file, cb) =>
    checkFileType(file, cb, [MimeTypes.jpg, MimeTypes.png, MimeTypes.webp]),
  storage: diskStorage({
    destination: (_, __, cb) => {
      const path = './uploads/avatars/'

      mkdirSync(path, { recursive: true })

      return cb(null, path)
    },
    filename: (_, file, cb) => cb(null, `${v4()}.${extension(file.mimetype)}`),
  }),
}

@ApiTags('Users')
@ApiBearerAuth('Auth')
@ApiUnauthorizedResponse({ description: 'Unauthorized user.' })
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user.' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    type: User,
    description: 'A new user has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiPayloadTooLargeResponse({ description: 'Payload too large.' })
  @ApiUnsupportedMediaTypeResponse({ description: 'Unsupported media type.' })
  @Post()
  @UseInterceptors(FileInterceptor('avatar', avatarInterceptorOptions))
  @Roles(UserRole.ADMIN)
  create(
    @UploadedFile()
    avatar: Express.Multer.File,
    @Body() userDto: CreateUserDto,
  ) {
    return this.usersService.create({
      ...userDto,
      avatar: avatar ? avatar.filename : null,
    })
  }

  @ApiOperation({ summary: 'Update a specific user.' })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    type: User,
    description: 'The user has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiNotFoundResponse({ description: 'The user was not found.' })
  @ApiForbiddenResponse({ description: 'Permissions error.' })
  @ApiPayloadTooLargeResponse({ description: 'Payload too large.' })
  @ApiUnsupportedMediaTypeResponse({ description: 'Unsupported media type.' })
  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar', avatarInterceptorOptions))
  update(
    @CurrentUser() authUser: User,
    @Param('id') id: string,
    @UploadedFile()
    avatar: Express.Multer.File,
    @Body() userDto: UpdateUserDto,
  ) {
    return this.usersService.update(authUser, Number(id), {
      ...userDto,
      avatar: avatar ? avatar.filename : undefined,
    })
  }

  @ApiOperation({ summary: 'Get all users.' })
  @ApiPagintaedResponse(User, {
    description: 'Users were successfully received.',
  })
  @Get()
  getAll(@Query() queryDto: QueryUsersDto) {
    return this.usersService.findAll(queryDto)
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
