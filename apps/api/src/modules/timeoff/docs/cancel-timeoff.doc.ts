import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'

export const CancelTimeOffDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Cancel a time off entry',
      description:
        'Cancels an active time off entry. Cancelled time off entries cannot be modified or used for scheduling.',
    }),
    ApiOkResponse({
      description: 'Time off cancelled successfully',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.OK },
          data: { type: 'object', nullable: true },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Time off entry not found',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.NOT_FOUND },
          error: { type: 'string', example: 'TimeOffNotFoundError' },
          message: {
            type: 'string',
            example:
              'Time off with ID f47ac10b-58cc-4372-a567-0e02b2c3d479 not found',
          },
          path: {
            type: 'string',
            example: '/businesses/:businessId/timeoff/:id/cancel',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Time off already cancelled',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'TimeOffAlreadyCancelledError' },
          message: {
            type: 'string',
            example: 'Time off is already cancelled',
          },
          path: {
            type: 'string',
            example: '/businesses/:businessId/timeoff/:id/cancel',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
