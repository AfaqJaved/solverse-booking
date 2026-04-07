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
import { UpdateWorkingHoursDto } from '../dto/update-working-hours.dto'

export const UpdateWorkingHoursDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update working hours',
      description:
        'Updates working hours schedule. Can mark day as open/closed or update opening/closing times.',
    }),
    ApiParam({
      name: 'workingHoursId',
      type: 'string',
      format: 'uuid',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    ApiBody({ type: UpdateWorkingHoursDto }),
    ApiOkResponse({
      description: 'Working hours updated successfully',
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
    ApiConflictResponse({
      description: 'Working hours already deleted',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.CONFLICT },
          error: { type: 'string', example: 'WorkingHoursDeletedError' },
          message: {
            type: 'string',
            example: 'Cannot update deleted working hours',
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
            example:
              'Invalid input: openTime and closeTime are required when isOpen is true',
          },
          path: {
            type: 'string',
            example: '/working-hours/f47ac10b-58cc-4372-a567-0e02b2c3d479',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
