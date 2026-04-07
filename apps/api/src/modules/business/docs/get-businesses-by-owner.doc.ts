import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'

export const GetBusinessesByOwnerDoc = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all businesses for an owner' }),
    ApiParam({ name: 'ownerId', format: 'uuid', description: 'Owner user ID' }),
    ApiOkResponse({
      description: 'List of businesses returned',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.OK },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                ownerId: { type: 'string', format: 'uuid' },
                name: { type: 'string', example: 'Acme Salon & Spa' },
                slug: { type: 'string', example: 'acme-salon' },
                email: { type: 'string', format: 'email' },
                phone: { type: 'string', nullable: true },
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
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid ownerId format',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError' },
          message: {
            type: 'string',
            example: 'Invalid input: ownerId must be a valid UUID',
          },
          path: { type: 'string', example: '/businesses/owner/:ownerId' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
