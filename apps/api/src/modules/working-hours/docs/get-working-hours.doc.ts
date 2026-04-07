import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiParam,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'

export const GetWorkingHoursDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get working hours by ID',
      description: 'Retrieves working hours details by its ID.',
    }),
    ApiParam({
      name: 'workingHoursId',
      type: 'string',
      format: 'uuid',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    ApiOkResponse({
      description: 'Working hours retrieved successfully',
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
              openTime: { type: 'string', example: '09:00', nullable: true },
              closeTime: { type: 'string', example: '17:30', nullable: true },
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
    ApiBadRequestResponse({
      description: 'Invalid working hours ID format',
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
