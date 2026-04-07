import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { DeleteWorkingHoursDto } from '../dto/delete-working-hours.dto'

export const DeleteWorkingHoursDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete working hours',
      description: 'Soft-deletes working hours (marks as deleted).',
    }),
    ApiParam({
      name: 'workingHoursId',
      type: 'string',
      format: 'uuid',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    ApiBody({ type: DeleteWorkingHoursDto }),
    ApiOkResponse({
      description: 'Working hours deleted successfully',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.OK },
          data: { type: 'object', example: {} },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Working hours not found',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.NOT_FOUND },
          error: { type: 'string', example: 'WorkingHoursNotFoundError' },
          message: {
            type: 'string',
            example:
              'Working hours with ID f47ac10b-58cc-4372-a567-0e02b2c3d479 not found',
          },
          path: {
            type: 'string',
            example: '/working-hours/f47ac10b-58cc-4372-a567-0e02b2c3d479',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiConflictResponse({
      description: 'Working hours already deleted',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.CONFLICT },
          error: { type: 'string', example: 'WorkingHoursDeletedError' },
          message: {
            type: 'string',
            example: 'Working hours already deleted',
          },
          path: {
            type: 'string',
            example: '/working-hours/f47ac10b-58cc-4372-a567-0e02b2c3d479',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input fields',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError' },
          message: {
            type: 'string',
            example: 'Invalid input: id must be a valid UUID v4',
          },
          path: { type: 'string', example: '/working-hours/invalid-id' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
