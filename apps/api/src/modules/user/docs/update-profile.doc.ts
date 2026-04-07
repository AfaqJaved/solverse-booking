import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'
import { UpdateProfileDto } from '../dto/update-profile.dto'

export const UpdateProfileDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update user profile',
      description: 'Updates timezone, phone, and/or notification preferences.',
    }),
    ApiParam({ name: 'userId', format: 'uuid', description: 'Target user ID' }),
    ApiBody({ type: UpdateProfileDto }),
    ApiOkResponse({
      description: 'Profile updated successfully',
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
          path: { type: 'string', example: '/users/:userId/profile' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input fields',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError' },
          message: {
            type: 'string',
            example: 'Invalid input: timezone must be a valid IANA timezone',
          },
          path: { type: 'string', example: '/users/:userId/profile' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
