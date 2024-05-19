import { Type, applyDecorators } from '@nestjs/common'
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger'
import { PaginatedDto } from '../dto/paginated.dto'

export const ApiPagintaedResponse = <TModel extends Type<any>>(
  model: TModel,
  options?: Omit<ApiResponseOptions, 'schema'>,
) => {
  return applyDecorators(
    ApiExtraModels(PaginatedDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
      ...options,
    }),
  )
}
