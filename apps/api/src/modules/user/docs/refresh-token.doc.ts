import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { RefreshTokenDto } from '../dto/refresh-token.dto'

export const RefreshTokenDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Refresh access token',
      description:
        'Accepts a valid refresh token and returns a new access token. The refresh token must be signed with JWT_REFRESH_SECRET.',
    }),
    ApiBody({ type: RefreshTokenDto }),
    ApiOkResponse({
      description: 'New access token issued successfully',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.OK },
          data: {
            type: 'object',
            properties: {
              accessToken: {
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
      description: 'Refresh token is invalid or expired',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.UNAUTHORIZED },
          error: { type: 'string', example: 'UserInvalidTokenError' },
          message: {
            type: 'string',
            example: 'Invalid or expired refresh token',
          },
          path: { type: 'string', example: '/users/refresh-token' },
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
          message: {
            type: 'string',
            example: 'User account has been suspended',
          },
          path: { type: 'string', example: '/users/refresh-token' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
