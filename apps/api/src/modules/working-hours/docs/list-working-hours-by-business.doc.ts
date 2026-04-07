import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiParam,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'

export const ListWorkingHoursByBusinessDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'List working hours by business',
      description: 'Retrieves all working hours for a specific business.',
    }),
    ApiParam({
      name: 'businessId',
      type: 'string',
      format: 'uuid',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiOkResponse({
      description: 'Working hours list retrieved successfully',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.OK },
          data: {
            type: 'object',
            properties: {
              workingHours: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      format: 'uuid',
                      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                    },
                    businessId: {
                      type: 'string',
                      format: 'uuid',
                      example: '550e8400-e29b-41d4-a716-446655440000',
                    },
                    dayOfWeek: {
                      type: 'string',
                      enum: [
                        'monday',
                        'tuesday',
                        'wednesday',
                        'thursday',
                        'friday',
                        'saturday',
                        'sunday',
                      ],
                      example: 'monday',
                    },
                    isOpen: { type: 'boolean', example: true },
                    openTime: {
                      type: 'string',
                      example: '09:00',
                      nullable: true,
                    },
                    closeTime: {
                      type: 'string',
                      example: '17:30',
                      nullable: true,
                    },
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
    ApiBadRequestResponse({
      description: 'Invalid business ID format',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError' },
          message: {
            type: 'string',
            example: 'Invalid input: businessId must be a valid UUID v4',
          },
          path: {
            type: 'string',
            example: '/businesses/invalid-id/working-hours',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
