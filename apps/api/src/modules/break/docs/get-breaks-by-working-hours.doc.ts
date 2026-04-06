import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger'

export const GetBreaksByWorkingHoursDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get breaks by working hours ID',
      description: 'Retrieves all breaks for specific working hours with pagination.',
    }),
    ApiQuery({
      name: 'workingHoursId',
      type: 'string',
      format: 'uuid',
      example: '550e8400-e29b-41d4-a716-446655440000',
      required: true,
    }),

    ApiOkResponse({
      description: 'Breaks retrieved successfully',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.OK },
          data: {
            type: 'object',
            properties: {
              breaks: {
                type: 'array',
                items: {
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
                  },
                },
              },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )