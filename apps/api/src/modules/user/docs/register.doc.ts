import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { RegisterDto } from '../dto/register.dto'

export const RegisterDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description:
        'Creates a new user account. Email verification is required before the account becomes active.',
    }),
    ApiBody({ type: RegisterDto }),
    ApiCreatedResponse({
      description: 'User registered successfully',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.CREATED },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiConflictResponse({
      description: 'Email or username already taken',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.CONFLICT },
          error: { type: 'string', example: 'EmailAlreadyTakenError' },
          message: {
            type: 'string',
            example: 'Email john@example.com is already taken',
          },
          path: { type: 'string', example: '/users/register' },
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
          message: { type: 'string', example: 'Invalid input: email must be a valid email address' },
          path: { type: 'string', example: '/users/register' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
