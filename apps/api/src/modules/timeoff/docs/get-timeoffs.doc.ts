import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger'

export const GetTimeOffsDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all time off entries for a business',
      description:
        'Retrieves all time off entries for a business, optionally filtered by date range and status.',
    }),
    ApiQuery({
      name: 'startDate',
      required: false,
      description:
        'Filter time off entries starting from this date (YYYY-MM-DD)',
      example: '2024-01-01',
    }),
    ApiQuery({
      name: 'endDate',
      required: false,
      description:
        'Filter time off entries ending before this date (YYYY-MM-DD)',
      example: '2024-12-31',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: 'Filter by time off status',
      enum: ['active', 'cancelled'],
      example: 'active',
    }),
    ApiOkResponse({
      description: 'Time off entries retrieved successfully',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.OK },
          data: {
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
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Business not found',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.NOT_FOUND },
          error: { type: 'string', example: 'BusinessNotFoundError' },
          message: {
            type: 'string',
            example:
              'Business with ID 123e4567-e89b-12d3-a456-426614174000 not found',
          },
          path: { type: 'string', example: '/businesses/:businessId/timeoff' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid query parameters',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError' },
          message: {
            type: 'string',
            example: 'Invalid input: startDate must be a valid date',
          },
          path: { type: 'string', example: '/businesses/:businessId/timeoff' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
