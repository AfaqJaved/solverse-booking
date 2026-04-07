import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOperation,
} from '@nestjs/swagger'

export const DeleteTimeOffDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete a time off entry',
      description:
        'Soft deletes a time off entry. The entry will be marked as deleted but remains in the database for audit purposes.',
    }),
    ApiNoContentResponse({
      description: 'Time off deleted successfully',
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
            example: '/businesses/:businessId/timeoff/:id',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid time off ID',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError' },
          message: {
            type: 'string',
            example: 'Invalid input: id must be a valid UUID',
          },
          path: {
            type: 'string',
            example: '/businesses/:businessId/timeoff/:id',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
