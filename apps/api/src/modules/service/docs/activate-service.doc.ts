import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'
import { ActivateServiceDto } from '../dto/activate-service.dto'

export const ActivateServiceDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Activate a service',
      description: 'Makes a service visible and bookable by customers.',
    }),
    ApiParam({
      name: 'serviceId',
      type: 'string',
      format: 'uuid',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    ApiBody({ type: ActivateServiceDto }),
    ApiOkResponse({
      description: 'Service activated successfully',
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
          path: { type: 'string', example: '/services/f47ac10b-58cc-4372-a567-0e02b2c3d479/activate' },
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
            example: 'Cannot activate a deleted service "Haircut"',
          },
          path: { type: 'string', example: '/services/f47ac10b-58cc-4372-a567-0e02b2c3d479/activate' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )