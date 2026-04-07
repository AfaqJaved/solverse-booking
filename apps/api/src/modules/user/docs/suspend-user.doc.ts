import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'
import { SuspendUserDto } from '../dto/suspend-user.dto'

export const SuspendUserDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Suspend user account',
      description:
        'Suspends a user account with a reason. Cannot be applied to already-suspended users.',
    }),
    ApiParam({ name: 'userId', format: 'uuid', description: 'Target user ID' }),
    ApiBody({ type: SuspendUserDto }),
    ApiOkResponse({
      description: 'Account suspended successfully',
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
          path: { type: 'string', example: '/users/:userId/suspend' },
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
            example: 'Cannot suspend a user in current state',
          },
          path: { type: 'string', example: '/users/:userId/suspend' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
