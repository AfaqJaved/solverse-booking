import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'
import { DeactivateServiceDto } from '../dto/deactivate-service.dto'

export const DeactivateServiceDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Deactivate a service',
      description: 'Hides a service from customers — no new bookings can be made. Existing appointments are not affected.',
    }),
    ApiParam({
      name: 'serviceId',
      type: 'string',
      format: 'uuid',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    ApiBody({ type: DeactivateServiceDto }),
    ApiOkResponse({
      description: 'Service deactivated successfully',
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
            example: 'Service with ID "f47ac10b-58cc-4372-a567-0e02b2c3d479" not found',
          },
          path: { type: 'string', example: '/services/f47ac10b-58cc-4372-a567-0e02b2c3d479/deactivate' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Service is deleted or invalid input',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'ServiceDeletedError' },
          message: {
            type: 'string',
            example: 'Cannot deactivate a deleted service "Haircut"',
          },
          path: { type: 'string', example: '/services/f47ac10b-58cc-4372-a567-0e02b2c3d479/deactivate' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )