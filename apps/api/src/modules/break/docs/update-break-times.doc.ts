import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'
import { UpdateBreakTimesDto } from '../dto/update-break-times.dto'

export const UpdateBreakTimesDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update break times',
      description: 'Updates the start and end times of a break. Times must not conflict with existing breaks.',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      format: 'uuid',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    ApiBody({ type: UpdateBreakTimesDto }),
    ApiOkResponse({
      description: 'Break times updated successfully',
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
              startTime: { type: 'string', example: '12:30' },
              endTime: { type: 'string', example: '13:30' },
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
    ApiConflictResponse({
      description: 'Break time conflicts with existing break',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.CONFLICT },
          error: { type: 'string', example: 'BreakTimeConflictError' },
          message: {
            type: 'string',
            example: 'Break time conflicts with existing break for working hours',
          },
          path: { type: 'string', example: '/breaks/f47ac10b-58cc-4372-a567-0e02b2c3d479' },
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
          message: { type: 'string', example: 'Invalid input: startTime must be in HH:MM 24-hour format' },
          path: { type: 'string', example: '/breaks/f47ac10b-58cc-4372-a567-0e02b2c3d479' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )