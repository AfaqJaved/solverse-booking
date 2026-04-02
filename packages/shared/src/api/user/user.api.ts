export namespace UserApi {
  export namespace Login {
    export interface Request {
      userNameOrEmail: string
      password: string
    }
    export interface Response {
      token: string
    }
  }
}
