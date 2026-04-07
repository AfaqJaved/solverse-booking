import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { CreateTimeOffDto } from '../dto/create-timeoff.dto'

export const CreateTimeOffDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create a new time off entry',
      description:
        'Creates a new time off entry for a business. Time off entries represent periods when the business is closed and not accepting bookings.',
    }),
    ApiBody({ type: CreateTimeOffDto }),
    ApiCreatedResponse({
      description: 'Time off created successfully',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.CREATED },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiConflictResponse({
      description: 'Time off conflicts with existing schedule',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.CONFLICT },
          error: { type: 'string', example: 'TimeOffConflictError' },
          message: {
            type: 'string',
            example: 'Time off conflicts with existing working hours or breaks',
          },
          path: { type: 'string', example: '/businesses/:businessId/timeoff' },
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
            example: 'Invalid input: startDate must be before endDate',
          },
          path: { type: 'string', example: '/businesses/:businessId/timeoff' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
