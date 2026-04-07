import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'
import { DeleteBreakDto } from '../dto/delete-break.dto'

export const DeleteBreakDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete a break',
      description:
        'Soft deletes a break by marking it as deleted. The break record remains in the database.',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      format: 'uuid',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    ApiBody({ type: DeleteBreakDto }),
    ApiOkResponse({
      description: 'Break deleted successfully',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.OK },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              },
              workingHoursId: {
                type: 'string',
                format: 'uuid',
                example: '550e8400-e29b-41d4-a716-446655440000',
              },
              label: { type: 'string', example: 'Lunch Break' },
              startTime: { type: 'string', example: '12:00' },
              endTime: { type: 'string', example: '13:00' },
              isDeleted: { type: 'boolean', example: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              createdBy: { type: 'string', format: 'uuid', nullable: true },
              updatedBy: { type: 'string', format: 'uuid', nullable: true },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Break not found',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.NOT_FOUND },
          error: { type: 'string', example: 'BreakNotFoundError' },
          message: {
            type: 'string',
            example:
              'Break with ID f47ac10b-58cc-4372-a567-0e02b2c3d479 not found',
          },
          path: {
            type: 'string',
            example: '/breaks/f47ac10b-58cc-4372-a567-0e02b2c3d479',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Break already deleted or invalid input',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'BreakDeletedError' },
          message: {
            type: 'string',
            example:
              'Break with ID f47ac10b-58cc-4372-a567-0e02b2c3d479 has already been deleted',
          },
          path: {
            type: 'string',
            example: '/breaks/f47ac10b-58cc-4372-a567-0e02b2c3d479',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
