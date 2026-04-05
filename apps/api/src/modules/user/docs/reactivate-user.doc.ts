import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'

export const ReactivateUserDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Reactivate user account',
      description:
        'Reactivates an inactive user account. Cannot be applied to suspended users.',
    }),
    ApiParam({ name: 'userId', format: 'uuid', description: 'Target user ID' }),
    ApiOkResponse({
      description: 'Account reactivated successfully',
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
          path: { type: 'string', example: '/users/:userId/reactivate' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'User is suspended and cannot be reactivated this way',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.FORBIDDEN },
          error: { type: 'string', example: 'UserSuspendedError' },
          message: {
            type: 'string',
            example: 'User account has been suspended',
          },
          path: { type: 'string', example: '/users/:userId/reactivate' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input or invalid state transition',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError | InvalidUserTransitionError' },
          message: {
            type: 'string',
            example: 'Cannot reactivate a user in current state',
          },
          path: { type: 'string', example: '/users/:userId/reactivate' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
