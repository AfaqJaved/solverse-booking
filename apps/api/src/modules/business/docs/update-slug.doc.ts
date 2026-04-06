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
import { UpdateBusinessSlugDto } from '../dto/update-slug.dto'

export const UpdateBusinessSlugDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update business slug',
      description: 'Changes the public booking URL slug. The new slug must be unique.',
    }),
    ApiParam({ name: 'businessId', format: 'uuid', description: 'Target business ID' }),
    ApiBody({ type: UpdateBusinessSlugDto }),
    ApiOkResponse({
      description: 'Slug updated successfully',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.OK },
          data: { type: 'object', nullable: true, example: null },
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
          message: { type: 'string', example: 'Slug "new-slug" is already taken' },
          path: { type: 'string', example: '/businesses/:businessId/slug' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Business not found',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.NOT_FOUND },
          error: { type: 'string', example: 'BusinessNotFoundError' },
          message: { type: 'string', example: 'Business not found: <businessId>' },
          path: { type: 'string', example: '/businesses/:businessId/slug' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input or business is deleted',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError | BusinessDeletedError' },
          message: { type: 'string', example: 'Cannot update the slug of a deleted business' },
          path: { type: 'string', example: '/businesses/:businessId/slug' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
