import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'

export const GetServiceDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get service by ID',
      description: 'Retrieves a service by its unique identifier.',
    }),
    ApiParam({
      name: 'serviceId',
      type: 'string',
      format: 'uuid',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    ApiOkResponse({
      description: 'Service retrieved successfully',
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
              name: { type: 'string', example: 'Haircut' },
              description: { type: 'string', example: 'Professional haircut with styling', nullable: true },
              duration: { type: 'number', example: 30 },
              bufferTime: { type: 'number', example: 10 },
              price: { type: 'number', example: 5000 },
              status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
              color: { type: 'string', example: '#FF5733', nullable: true },
              maxBookingsPerSlot: { type: 'number', example: 2 },
              isDeleted: { type: 'boolean', example: false },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              createdBy: { type: 'string', format: 'uuid' },
              updatedBy: { type: 'string', format: 'uuid' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Service not found',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.NOT_FOUND },
          error: { type: 'string', example: 'ServiceNotFoundError' },
          message: {
            type: 'string',
            example: 'Service with ID "f47ac10b-58cc-4372-a567-0e02b2c3d479" not found',
          },
          path: { type: 'string', example: '/services/f47ac10b-58cc-4372-a567-0e02b2c3d479' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid service ID',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError' },
          message: {
            type: 'string',
            example: 'Invalid input: serviceId must be a valid UUID',
          },
          path: { type: 'string', example: '/services/invalid-id' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )