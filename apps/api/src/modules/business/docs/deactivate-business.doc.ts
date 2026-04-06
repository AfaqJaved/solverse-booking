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

export const DeactivateBusinessDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Deactivate business',
      description: 'Voluntarily pauses the business. Only allowed from the active state.',
    }),
    ApiParam({ name: 'businessId', format: 'uuid', description: 'Target business ID' }),
    ApiBody({ type: ActorDto }),
    ApiOkResponse({
      description: 'Business deactivated successfully',
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
          message: { type: 'string', example: 'Business not found: <businessId>' },
          path: { type: 'string', example: '/businesses/:businessId/deactivate' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input or invalid state transition',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError | InvalidBusinessTransitionError' },
          message: { type: 'string', example: 'Cannot deactivate a suspended business — lift the suspension first' },
          path: { type: 'string', example: '/businesses/:businessId/deactivate' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
