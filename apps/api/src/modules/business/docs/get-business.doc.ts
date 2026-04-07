import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'

export const GetBusinessDoc = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get business by ID' }),
    ApiParam({
      name: 'businessId',
      format: 'uuid',
      description: 'Target business ID',
    }),
    ApiOkResponse({
      description: 'Business found',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.OK },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              ownerId: { type: 'string', format: 'uuid' },
              name: { type: 'string', example: 'Acme Salon & Spa' },
              slug: { type: 'string', example: 'acme-salon' },
              email: {
                type: 'string',
                format: 'email',
                example: 'contact@acmesalon.com',
              },
              phone: {
                type: 'string',
                nullable: true,
                example: '+12025551234',
              },
              timezone: { type: 'string', example: 'America/New_York' },
              status: {
                type: 'string',
                enum: [
                  'pending_verification',
                  'active',
                  'inactive',
                  'suspended',
                ],
              },
              plan: {
                type: 'string',
                enum: ['free', 'starter', 'pro', 'enterprise'],
              },
              currency: { type: 'string', example: 'USD' },
              logoUrl: { type: 'string', nullable: true },
              description: { type: 'string', nullable: true },
              website: { type: 'string', nullable: true },
              isDeleted: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' },
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
            example: 'Business not found: <businessId>',
          },
          path: { type: 'string', example: '/businesses/:businessId' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid businessId format',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError' },
          message: {
            type: 'string',
            example: 'Invalid input: businessId must be a valid UUID',
          },
          path: { type: 'string', example: '/businesses/:businessId' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
