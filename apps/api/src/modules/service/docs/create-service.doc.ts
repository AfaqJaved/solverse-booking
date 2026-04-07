import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { CreateServiceDto } from '../dto/create-service.dto'

export const CreateServiceDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create a new service',
      description:
        'Creates a new service for a business. Service names must be unique within a business.',
    }),
    ApiBody({ type: CreateServiceDto }),
    ApiCreatedResponse({
      description: 'Service created successfully',
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
              name: { type: 'string', example: 'Haircut' },
              description: {
                type: 'string',
                example: 'Professional haircut with styling',
                nullable: true,
              },
              duration: { type: 'number', example: 30 },
              bufferTime: { type: 'number', example: 10 },
              price: { type: 'number', example: 5000 },
              status: {
                type: 'string',
                enum: ['active', 'inactive'],
                example: 'active',
              },
              color: { type: 'string', example: '#FF5733', nullable: true },
              maxBookingsPerSlot: { type: 'number', example: 2 },
              isDeleted: { type: 'boolean', example: false },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiConflictResponse({
      description: 'Service name already taken for this business',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.CONFLICT },
          error: { type: 'string', example: 'ServiceNameTakenError' },
          message: {
            type: 'string',
            example:
              'Service name "Haircut" is already taken for this business',
          },
          path: { type: 'string', example: '/services' },
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
              'Invalid input: duration must be between 5 and 480 minutes',
          },
          path: { type: 'string', example: '/services' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
