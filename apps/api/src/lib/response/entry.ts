export class ApiErrorResponse {
  readonly statusCode: number
  readonly errorTag: string
  readonly message: string
  readonly path: string
  readonly timestamp: string
  readonly trace?: string

  constructor(
    statusCode: number,
    error: string,
    message: string,
    path: string,
    trace?: string,
  ) {
    this.statusCode = statusCode
    this.errorTag = error
    this.message = message
    this.path = path
    this.timestamp = new Date().toISOString()

    // only send trace while in dev mode
    if (trace && process.env.NODE_ENV !== 'production') {
      this.trace = trace
    }
  }
}
