import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'

export const GetServicesByBusinessDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get services by business ID',
      description: 'Retrieves all services for a specific business. Only returns non-deleted services.',
    }),
    ApiParam({
      name: 'businessId',
      type: 'string',
      format: 'uuid',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiOkResponse({
      description: 'Services retrieved successfully',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.OK },
          data: {
            type: 'object',
            properties: {
              services: {
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
                  },
                },
              },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid business ID',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError' },
          message: {
            type: 'string',
            example: 'Invalid input: businessId must be a valid UUID',
          },
          path: { type: 'string', example: '/businesses/invalid-id/services' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )