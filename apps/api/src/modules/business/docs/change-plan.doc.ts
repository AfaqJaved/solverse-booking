import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'
import { ChangePlanDto } from '../dto/change-plan.dto'

export const ChangePlanDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Change subscription plan',
      description: 'Changes the business subscription plan. Not allowed when the business is suspended or deleted.',
    }),
    ApiParam({ name: 'businessId', format: 'uuid', description: 'Target business ID' }),
    ApiBody({ type: ChangePlanDto }),
    ApiOkResponse({
      description: 'Plan changed successfully',
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
          path: { type: 'string', example: '/businesses/:businessId/plan' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input, business is suspended or deleted',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
          error: { type: 'string', example: 'InvalidInputError | BusinessSuspendedError | BusinessDeletedError' },
          message: { type: 'string', example: 'Cannot change the plan of a suspended business' },
          path: { type: 'string', example: '/businesses/:businessId/plan' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
