import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'

export const VerifyEmailDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Verify user email',
      description:
        'Marks the user email as verified and activates the account.',
    }),
    ApiParam({ name: 'userId', format: 'uuid', description: 'Target user ID' }),
    ApiOkResponse({
      description: 'Email verified and account activated',
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
          path: { type: 'string', example: '/users/:userId/verify-email' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input, email not yet verified externally, or invalid transition',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: {
            type: 'string',
            example: 'InvalidInputError | EmailNotVerifiedError | InvalidUserTransitionError',
          },
          message: {
            type: 'string',
            example: 'Email not verified for the user',
          },
          path: { type: 'string', example: '/users/:userId/verify-email' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiConflictResponse({
      description: 'User is already active',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.CONFLICT },
          error: { type: 'string', example: 'UserAlreadyActiveError' },
          message: { type: 'string', example: 'User already is active' },
          path: { type: 'string', example: '/users/:userId/verify-email' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
