import * as jwt from 'jsonwebtoken'
import { Config, Effect } from 'effect'
import {
  JwtExpiredError,
  JwtMalformedError,
  JwtSignError,
  JwtVerifyError,
} from './errors/entry'

export type JwtPayload<
  T extends Record<string, unknown> = Record<string, unknown>,
> = jwt.JwtPayload & T

export interface TokenOptions {
  expiresIn: `${number}h`
  issuer: string
  secretEnvKey?: string
}

export class JwtUtils {
  private static getSecret(
    secretEnvKey: string = 'JWT_SECRET',
  ): Effect.Effect<string, never, never> {
    return Config.nonEmptyString(secretEnvKey).pipe(Effect.orDie)
  }

  static createToken<T extends Record<string, unknown>>(
    payload: T,
    options: TokenOptions,
  ): Effect.Effect<string, JwtSignError> {
    return Effect.gen(function* () {
      const secret = yield* JwtUtils.getSecret(options.secretEnvKey)
      return yield* Effect.try({
        try: () =>
          jwt.sign(payload, secret, {
            expiresIn: options.expiresIn,
            issuer: options.issuer,
          }),
        catch: (cause) =>
          new JwtSignError({ message: 'Failed to sign JWT', cause }),
      })
    })
  }

  static verifyToken<T extends Record<string, unknown>>(
    token: string,
    options: Pick<TokenOptions, 'issuer' | 'secretEnvKey'>,
  ): Effect.Effect<
    JwtPayload<T>,
    JwtExpiredError | JwtMalformedError | JwtVerifyError
  > {
    return Effect.gen(function* () {
      const secret = yield* JwtUtils.getSecret(options.secretEnvKey)
      return yield* Effect.try({
        try: () => {
          const decoded = jwt.verify(token, secret, {
            issuer: options.issuer,
          })
          return decoded as JwtPayload<T>
        },
        catch: (cause) => {
          if (cause instanceof jwt.TokenExpiredError) {
            return new JwtExpiredError({
              message: 'JWT has expired',
              cause: 'JWT has expired',
            })
          }
          if (
            cause instanceof jwt.JsonWebTokenError ||
            cause instanceof jwt.NotBeforeError
          ) {
            return new JwtMalformedError({
              message: cause.message ?? 'JWT is invalid',
              cause: cause.message ?? 'JWT is invalid',
            })
          }
          return new JwtVerifyError({ message: 'Failed to verify JWT', cause })
        },
      })
    })
  }
}
