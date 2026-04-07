import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { UpdateTimeOffDto } from '../dto/update-timeoff.dto'

export const UpdateTimeOffDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update a time off entry',
      description:
        'Updates an existing time off entry. Only active time off entries can be updated.',
    }),
    ApiBody({ type: UpdateTimeOffDto }),
    ApiOkResponse({
      description: 'Time off updated successfully',
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
            example: '/businesses/:businessId/timeoff/:id',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input or time off is cancelled',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError' },
          message: {
            type: 'string',
            example: 'Invalid input: cannot update cancelled time off',
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
