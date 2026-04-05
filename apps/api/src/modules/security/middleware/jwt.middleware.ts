import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { Effect } from 'effect'
import { JwtUtils } from 'src/lib/jwt/jwt.utils'
import { LoginJwtPayload } from 'src/lib/jwt/payload/login.jwt.payload'

const PUBLIC_URLS: string[] = ['/users/login', '/users/register']

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (PUBLIC_URLS.includes(req.path)) {
      return next()
    }

    const authHeader = req.headers['authorization']
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header')
    }

    const token = authHeader.slice(7)

    const result = await Effect.runPromise(
      Effect.either(
        JwtUtils.verifyToken<LoginJwtPayload>(token, { issuer: 'solverse' }),
      ),
    )

    if (result._tag === 'Left') {
      throw new UnauthorizedException('Invalid or expired token')
    }

    req['securityContext'] = result.right
    next()
  }
}
