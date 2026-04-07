import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'

export const GetTimeOffDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get a specific time off entry',
      description: 'Retrieves a specific time off entry by its ID.',
    }),
    ApiOkResponse({
      description: 'Time off entry retrieved successfully',
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
                example: '123e4567-e89b-12d3-a456-426614174000',
              },
              label: { type: 'string', example: 'Christmas Holiday' },
              allDay: { type: 'boolean', example: true },
              cadence: {
                type: 'string',
                enum: ['once', 'daily', 'weekly', 'monthly', 'yearly'],
                example: 'once',
              },
              status: {
                type: 'string',
                enum: ['active', 'cancelled'],
                example: 'active',
              },
              startDate: {
                type: 'string',
                format: 'date',
                example: '2024-12-24',
              },
              endDate: {
                type: 'string',
                format: 'date',
                example: '2024-12-26',
              },
              startTime: { type: 'string', nullable: true, example: null },
              endTime: { type: 'string', nullable: true, example: null },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00Z',
              },
              createdBy: { type: 'string', nullable: true, example: null },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00Z',
              },
              updatedBy: { type: 'string', nullable: true, example: null },
            },
          },
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
      description: 'Invalid time off ID',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError' },
          message: {
            type: 'string',
            example: 'Invalid input: id must be a valid UUID',
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
