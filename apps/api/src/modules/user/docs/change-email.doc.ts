import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'
import { ChangeEmailDto } from '../dto/change-email.dto'

export const ChangeEmailDoc = () =>
  applyDecorators(
    ApiOperation({ summary: 'Change user email' }),
    ApiParam({ name: 'userId', format: 'uuid', description: 'Target user ID' }),
    ApiBody({ type: ChangeEmailDto }),
    ApiOkResponse({
      description: 'Email changed successfully',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.OK },
          data: { type: 'object', nullable: true, example: null },
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
          path: { type: 'string', example: '/users/:userId/email' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiConflictResponse({
      description: 'New email is already taken',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.CONFLICT },
          error: { type: 'string', example: 'EmailAlreadyTakenError' },
          message: {
            type: 'string',
            example: 'Email newemail@example.com is already taken',
          },
          path: { type: 'string', example: '/users/:userId/email' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid userId or email format',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError' },
          message: { type: 'string', example: 'Invalid input: newEmail must be a valid email address' },
          path: { type: 'string', example: '/users/:userId/email' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
