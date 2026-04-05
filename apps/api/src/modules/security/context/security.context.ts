import { Injectable, Inject, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { UserRole } from '@solverse/domain'
import { LoginJwtPayload } from 'src/lib/jwt/payload/login.jwt.payload'
import { JwtPayload } from 'src/lib/jwt/jwt.utils'

@Injectable({ scope: Scope.REQUEST })
export class SecurityContext {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  get userId(): string {
    return this.payload.userId
  }

  get role(): UserRole {
    return this.payload.role
  }

  private get payload(): JwtPayload<LoginJwtPayload> {
    return this.request['securityContext']
  }
}
