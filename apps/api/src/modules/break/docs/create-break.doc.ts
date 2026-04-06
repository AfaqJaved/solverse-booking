import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { CreateBreakDto } from '../dto/create-break.dto'

export const CreateBreakDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create a new break',
      description: 'Creates a new break for working hours. Break times must not conflict with existing breaks.',
    }),
    ApiBody({ type: CreateBreakDto }),
    ApiCreatedResponse({
      description: 'Break created successfully',
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
            },
          },
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
          path: { type: 'string', example: '/breaks' },
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
          path: { type: 'string', example: '/breaks' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )