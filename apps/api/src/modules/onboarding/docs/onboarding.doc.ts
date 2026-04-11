import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { OnboardingDto } from '../dto/onboarding.dto'

const errorSchema = (example: {
  statusCode: number
  error: string
  message: string
}) => ({
  type: 'object',
  properties: {
    statusCode: { type: 'number', example: example.statusCode },
    error: { type: 'string', example: example.error },
    message: { type: 'string', example: example.message },
    path: { type: 'string', example: '/onboarding/register' },
    timestamp: { type: 'string', format: 'date-time' },
  },
})

export const RegisterOnboardingDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Complete business onboarding',
      description: [
        'Creates a user account and business in a single request, then optionally sets up working hours, breaks, time offs, and services.',
        'Execution is fail-fast — if any step fails the operation stops immediately and returns the error.',
        '',
        '**Steps (in order):**',
        '1. Register user (`businessOwner` role)',
        '2. Register business',
        '3. Create working hours (one record per day — all 7 required)',
        '4. Create breaks (optional)',
        '5. Create time offs (optional)',
        '6. Create services (optional)',
      ].join('\n'),
    }),
    ApiBody({ type: OnboardingDto }),

    // ── 201 ───────────────────────────────────────────────────────────────────
    ApiCreatedResponse({
      description: 'Onboarding completed successfully',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: HttpStatus.CREATED },
          data: {
            type: 'object',
            properties: {
              userId: {
                type: 'string',
                format: 'uuid',
                example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              },
              businessId: {
                type: 'string',
                format: 'uuid',
                example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),

    // ── 400 ───────────────────────────────────────────────────────────────────
    ApiBadRequestResponse({
      description: [
        '**One of the following errors:**',
        '- `InvalidInputError` — a field failed domain validation (e.g. invalid slug format, bad timezone, password too short)',
        '- `BreakTimeConflictError` — a break overlaps with an existing break for the same working-hours slot',
        '- `TimeOffDateRangeError` — `startDate` is after `endDate`',
        '- `TimeOffTimeRangeError` — `startTime` is after or equal to `endTime`',
        '- `TimeOffAlreadyActiveError` — time off is already in an active state',
        '- `TimeOffAlreadyCancelledError` — time off is already cancelled',
        '- `TimeOffDeletedError` — time off has been deleted',
      ].join('\n'),
      schema: {
        oneOf: [
          errorSchema({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'InvalidInputError',
            message:
              'Invalid input: slug must contain only lowercase letters, digits, and hyphens',
          }),
          errorSchema({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'BreakTimeConflictError',
            message: 'Break time 12:00-13:00 conflicts with existing break',
          }),
          errorSchema({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'TimeOffDateRangeError',
            message: 'startDate must be before or equal to endDate',
          }),
          errorSchema({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'TimeOffTimeRangeError',
            message: 'startTime must be before endTime',
          }),
          errorSchema({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'TimeOffAlreadyActiveError',
            message: 'Time off is already active',
          }),
          errorSchema({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'TimeOffAlreadyCancelledError',
            message: 'Time off is already cancelled',
          }),
          errorSchema({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'TimeOffDeletedError',
            message: 'Time off has been deleted',
          }),
        ],
      },
    }),

    // ── 409 ───────────────────────────────────────────────────────────────────
    ApiConflictResponse({
      description: [
        '**One of the following errors:**',
        '- `EmailAlreadyTakenError` — email or username already registered',
        '- `BusinessSlugTakenError` — business slug is already in use',
        '- `WorkingHoursDayTakenError` — a working-hours record for that day already exists',
        '- `ServiceNameTakenError` — a service with the same name already exists for this business',
      ].join('\n'),
      schema: {
        oneOf: [
          errorSchema({
            statusCode: HttpStatus.CONFLICT,
            error: 'EmailAlreadyTakenError',
            message: 'Email jane@example.com is already taken',
          }),
          errorSchema({
            statusCode: HttpStatus.CONFLICT,
            error: 'BusinessSlugTakenError',
            message: 'Slug "janes-salon" is already taken',
          }),
          errorSchema({
            statusCode: HttpStatus.CONFLICT,
            error: 'WorkingHoursDayTakenError',
            message: 'Working hours for monday already exist for this business',
          }),
          errorSchema({
            statusCode: HttpStatus.CONFLICT,
            error: 'ServiceNameTakenError',
            message:
              'Service name "Haircut" is already taken for this business',
          }),
        ],
      },
    }),

    // ── 500 ───────────────────────────────────────────────────────────────────
    ApiInternalServerErrorResponse({
      description:
        '`Internal Server Error ` — an unexpected error occurred at any step',
      schema: errorSchema({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      }),
    }),
  )
