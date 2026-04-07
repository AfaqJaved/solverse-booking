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

export const ReactivateBusinessDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Reactivate business',
      description:
        'Restores an inactive or suspended business back to active status.',
    }),
    ApiParam({
      name: 'businessId',
      format: 'uuid',
      description: 'Target business ID',
    }),
    ApiBody({ type: ActorDto }),
    ApiOkResponse({
      description: 'Business reactivated successfully',
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
          path: {
            type: 'string',
            example: '/businesses/:businessId/reactivate',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description:
        'Invalid input, invalid state transition, or business is deleted',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: {
            type: 'string',
            example:
              'InvalidInputError | InvalidBusinessTransitionError | BusinessDeletedError',
          },
          message: {
            type: 'string',
            example: 'Business is not inactive or suspended',
          },
          path: {
            type: 'string',
            example: '/businesses/:businessId/reactivate',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
