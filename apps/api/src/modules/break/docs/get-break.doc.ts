import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'

export const GetBreakDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get a break by ID',
      description: 'Retrieves a break by its ID. Returns 404 if break not found or deleted.',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      format: 'uuid',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    ApiOkResponse({
      description: 'Break retrieved successfully',
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
              isDeleted: { type: 'boolean', example: false },
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
      description: 'Break not found or deleted',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.NOT_FOUND },
          error: { type: 'string', example: 'BreakNotFoundError' },
          message: {
            type: 'string',
            example: 'Break with ID f47ac10b-58cc-4372-a567-0e02b2c3d479 not found',
          },
          path: { type: 'string', example: '/breaks/f47ac10b-58cc-4372-a567-0e02b2c3d479' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )