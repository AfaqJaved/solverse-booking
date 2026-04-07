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

export const ActivateBusinessDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Activate business',
      description:
        'Transitions the business from pending_verification to active. Only valid from the pending_verification state.',
    }),
    ApiParam({
      name: 'businessId',
      format: 'uuid',
      description: 'Target business ID',
    }),
    ApiBody({ type: ActorDto }),
    ApiOkResponse({
      description: 'Business activated successfully',
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
          path: { type: 'string', example: '/businesses/:businessId/activate' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input or invalid state transition',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: {
            type: 'string',
            example:
              'InvalidInputError | BusinessAlreadyActiveError | InvalidBusinessTransitionError',
          },
          message: {
            type: 'string',
            example:
              'Cannot activate a suspended business — use reactivate() instead',
          },
          path: { type: 'string', example: '/businesses/:businessId/activate' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
