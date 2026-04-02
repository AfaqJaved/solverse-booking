export class ApiResponse<T> {
  readonly statusCode: number
  readonly data: T
  readonly timestamp: string

  constructor(statusCode: number, data: T) {
    this.statusCode = statusCode
    this.data = data
    this.timestamp = new Date().toISOString()
  }

  static ok<T>(data: T): ApiResponse<T> {
    return new ApiResponse(200, data)
  }

  static created<T>(data: T): ApiResponse<T> {
    return new ApiResponse(201, data)
  }
}
