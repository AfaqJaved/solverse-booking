import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'
import { ActorDto } from '../dto/actor.dto'

export const DeleteBusinessDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete business',
      description:
        'Soft-deletes the business. Data is retained for audit purposes.',
    }),
    ApiParam({
      name: 'businessId',
      format: 'uuid',
      description: 'Target business ID',
    }),
    ApiBody({ type: ActorDto }),
    ApiOkResponse({
      description: 'Business deleted successfully',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.OK },
          data: { type: 'object', nullable: true, example: null },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Business not found',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.NOT_FOUND },
          error: { type: 'string', example: 'BusinessNotFoundError' },
          message: {
            type: 'string',
            example: 'Business not found: <businessId>',
          },
          path: { type: 'string', example: '/businesses/:businessId' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input or business already deleted',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: {
            type: 'string',
            example: 'InvalidInputError | BusinessDeletedError',
          },
          message: {
            type: 'string',
            example: 'Business has already been deleted',
          },
          path: { type: 'string', example: '/businesses/:businessId' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
