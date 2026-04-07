import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'

export const DeactivateUserDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Deactivate user account',
      description:
        'Voluntarily deactivates the user account. Cannot be applied to already-inactive or suspended users.',
    }),
    ApiParam({ name: 'userId', format: 'uuid', description: 'Target user ID' }),
    ApiOkResponse({
      description: 'Account deactivated successfully',
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
          path: { type: 'string', example: '/users/:userId' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input or invalid state transition',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: {
            type: 'string',
            example: 'InvalidInputError | InvalidUserTransitionError',
          },
          message: {
            type: 'string',
            example: 'Cannot deactivate a user in current state',
          },
          path: { type: 'string', example: '/users/:userId' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
