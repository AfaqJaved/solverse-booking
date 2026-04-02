import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Cause, Option, Runtime } from 'effect'
import { Request, Response } from 'express'
import { ApiErrorResponse } from '@solverse/shared'
import { isApplicationError } from './is.application.error'
import { resolveHttpStatus } from './resolve.http.status'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(rawException: unknown, host: ArgumentsHost): void {
    const exception = unwrapFiberFailure(rawException)
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse())
      return
    }

    if (isApplicationError(exception)) {
      const status = resolveHttpStatus(exception)
      const trace = exception instanceof Error ? exception.stack : undefined

      if (exception.sendToFrontEnd) {
        response
          .status(status)
          .json(
            new ApiErrorResponse(
              status,
              exception._tag,
              exception.message,
              request.url,
              trace,
            ),
          )
      } else {
        this.logger.error(
          `Internal error [${exception._tag}]: ${JSON.stringify(exception)}`,
        )
        response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(
            new ApiErrorResponse(
              HttpStatus.INTERNAL_SERVER_ERROR,
              'InternalServerError',
              'An unexpected error occurred.',
              request.url,
              trace,
            ),
          )
      }
      return
    }

    const trace = rawException instanceof Error ? rawException.stack : undefined
    this.logger.error('Unhandled exception', rawException)
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        new ApiErrorResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'InternalServerError',
          'An unexpected error occurred.',
          request.url,
          trace,
        ),
      )
  }
}
function unwrapFiberFailure(exception: unknown): unknown {
  if (Runtime.isFiberFailure(exception)) {
    const failure = Cause.failureOption(exception[Runtime.FiberFailureCauseId])
    if (Option.isSome(failure)) return failure.value
  }
  return exception
}
