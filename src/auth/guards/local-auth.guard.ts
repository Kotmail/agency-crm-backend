import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { UserLogInDto } from '../dto/user-log-in.dto'
import { validate } from 'class-validator'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()

    const body = plainToClass(UserLogInDto, request.body)

    const errors = await validate(body)

    const errorMessages = errors.flatMap(({ constraints }) =>
      Object.values(constraints),
    )

    if (errorMessages.length > 0) {
      response.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: errorMessages,
      })
    }

    return super.canActivate(context) as boolean | Promise<boolean>
  }
}
