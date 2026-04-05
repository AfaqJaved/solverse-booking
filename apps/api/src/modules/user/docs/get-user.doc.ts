import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'

export const GetUserDoc = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get user by ID' }),
    ApiParam({ name: 'userId', format: 'uuid', description: 'Target user ID' }),
    ApiOkResponse({
      description: 'User found',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.OK },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              username: { type: 'string', example: 'john_doe' },
              name: {
                type: 'object',
                properties: {
                  firstName: { type: 'string', example: 'John' },
                  lastName: { type: 'string', example: 'Doe' },
                },
              },
              email: {
                type: 'string',
                format: 'email',
                example: 'john@example.com',
              },
              phone: {
                type: 'string',
                nullable: true,
                example: '+12025551234',
              },
              role: {
                type: 'string',
                enum: ['superAdmin', 'businessOwner', 'locationOwner'],
              },
              status: {
                type: 'string',
                enum: ['active', 'inactive', 'suspended'],
              },
              timezone: { type: 'string', example: 'America/New_York' },
              avatarUrl: { type: 'string', nullable: true },
              emailVerified: { type: 'boolean' },
              notificationPreferences: {
                type: 'object',
                properties: {
                  email: { type: 'boolean' },
                  sms: { type: 'boolean' },
                  push: { type: 'boolean' },
                },
              },
              lastLoginAt: {
                type: 'string',
                format: 'date-time',
                nullable: true,
              },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'User not found',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.NOT_FOUND },
          error: { type: 'string', example: 'UserNotFoundError' },
          message: { type: 'string', example: 'User not found: <userId>' },
          path: { type: 'string', example: '/users/:userId' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
