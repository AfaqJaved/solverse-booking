import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'
import { SuspendBusinessDto } from '../dto/suspend-business.dto'

export const SuspendBusinessDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Suspend business',
      description:
        'Administratively suspends the business with a mandatory reason.',
    }),
    ApiParam({
      name: 'businessId',
      format: 'uuid',
      description: 'Target business ID',
    }),
    ApiBody({ type: SuspendBusinessDto }),
    ApiOkResponse({
      description: 'Business suspended successfully',
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
          path: { type: 'string', example: '/businesses/:businessId/suspend' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input, already suspended, or business is deleted',
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
            example: 'Cannot suspend a deleted business',
          },
          path: { type: 'string', example: '/businesses/:businessId/suspend' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
