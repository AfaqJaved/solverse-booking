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
import { UpdateServiceDto } from '../dto/update-service.dto'

export const UpdateServiceDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update service details',
      description:
        'Updates the details of an existing service. Service names must remain unique within the business.',
    }),
    ApiParam({
      name: 'serviceId',
      type: 'string',
      format: 'uuid',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    ApiBody({ type: UpdateServiceDto }),
    ApiOkResponse({
      description: 'Service updated successfully',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.OK },
          data: { type: 'object', nullable: true },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Service not found',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.NOT_FOUND },
          error: { type: 'string', example: 'ServiceNotFoundError' },
          message: {
            type: 'string',
            example:
              'Service with ID "f47ac10b-58cc-4372-a567-0e02b2c3d479" not found',
          },
          path: {
            type: 'string',
            example: '/services/f47ac10b-58cc-4372-a567-0e02b2c3d479',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiConflictResponse({
      description: 'Service name already taken for this business',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.CONFLICT },
          error: { type: 'string', example: 'ServiceNameTakenError' },
          message: {
            type: 'string',
            example:
              'Service name "Premium Haircut" is already taken for this business',
          },
          path: {
            type: 'string',
            example: '/services/f47ac10b-58cc-4372-a567-0e02b2c3d479',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input fields or service is deleted',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError' },
          message: {
            type: 'string',
            example:
              'Invalid input: duration must be between 5 and 480 minutes',
          },
          path: {
            type: 'string',
            example: '/services/f47ac10b-58cc-4372-a567-0e02b2c3d479',
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
