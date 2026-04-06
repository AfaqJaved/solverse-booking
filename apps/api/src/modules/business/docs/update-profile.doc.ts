import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'
import { UpdateBusinessProfileDto } from '../dto/update-profile.dto'

export const UpdateBusinessProfileDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update business profile',
      description: 'Updates public-facing profile fields. Only provided fields are overwritten.',
    }),
    ApiParam({ name: 'businessId', format: 'uuid', description: 'Target business ID' }),
    ApiBody({ type: UpdateBusinessProfileDto }),
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
      description: 'Business not found',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.NOT_FOUND },
          error: { type: 'string', example: 'BusinessNotFoundError' },
          message: { type: 'string', example: 'Business not found: <businessId>' },
          path: { type: 'string', example: '/businesses/:businessId/profile' },
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
          message: { type: 'string', example: 'Cannot update a deleted business' },
          path: { type: 'string', example: '/businesses/:businessId/profile' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
