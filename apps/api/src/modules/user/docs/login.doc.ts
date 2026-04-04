import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { LoginDto } from '../dto/login.dto'

export const LoginDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Login a user',
      description:
        'Authenticates a user by username or email and password, returns a JWT token.',
    }),
    ApiBody({ type: LoginDto }),
    ApiOkResponse({
      description: 'Login successful',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.OK },
          data: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'User not found or invalid credentials',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.UNAUTHORIZED },
          error: {
            type: 'string',
            example: 'UserNotFoundError | UserInvalidCredentialsError',
          },
          message: { type: 'string', example: 'Invalid credentials' },
          path: { type: 'string', example: '/users/login' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'User account is inactive or suspended',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.FORBIDDEN },
          error: {
            type: 'string',
            example: 'UserInactiveError | UserSuspendedError',
          },
          message: { type: 'string', example: 'User account has been suspended' },
          path: { type: 'string', example: '/users/login' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
