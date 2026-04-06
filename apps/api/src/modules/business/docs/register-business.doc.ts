import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { RegisterBusinessDto } from '../dto/register-business.dto'

export const RegisterBusinessDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Register a new business',
      description:
        'Creates a new business. The slug must be unique and will be used in public booking URLs.',
    }),
    ApiBody({ type: RegisterBusinessDto }),
    ApiCreatedResponse({
      description: 'Business registered successfully',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.CREATED },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiConflictResponse({
      description: 'Slug already taken',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.CONFLICT },
          error: { type: 'string', example: 'BusinessSlugTakenError' },
          message: { type: 'string', example: 'Slug "acme-salon" is already taken' },
          path: { type: 'string', example: '/businesses' },
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
          message: { type: 'string', example: 'Invalid input: slug must contain only lowercase letters, digits, and hyphens' },
          path: { type: 'string', example: '/businesses' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
