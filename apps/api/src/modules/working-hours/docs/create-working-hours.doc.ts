import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { CreateWorkingHoursDto } from '../dto/create-working-hours.dto'

export const CreateWorkingHoursDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create new working hours',
      description:
        'Creates working hours for a specific day of the week for a business. Each business can have only one schedule per day.',
    }),
    ApiBody({ type: CreateWorkingHoursDto }),
    ApiCreatedResponse({
      description: 'Working hours created successfully',
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
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiConflictResponse({
      description: 'Working hours for this day already exist for the business',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.CONFLICT },
          error: { type: 'string', example: 'WorkingHoursDayTakenError' },
          message: {
            type: 'string',
            example: 'Working hours for monday already exist for this business',
          },
          path: { type: 'string', example: '/working-hours' },
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
            example: 'Invalid input: openTime must be in HH:MM format',
          },
          path: { type: 'string', example: '/working-hours' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
