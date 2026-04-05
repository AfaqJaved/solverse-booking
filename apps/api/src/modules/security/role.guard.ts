import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  HttpStatus,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { UserRoleType } from '@solverse/domain'
import { ApiErrorResponse } from '@solverse/shared'
import { SecurityContext } from './context/security.context'
import { ROLES_KEY } from './decorator/roles.decorator'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly securityContext: SecurityContext,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const userRole = this.securityContext.role

    if (!requiredRoles.includes(userRole as UserRoleType)) {
      const request = context.switchToHttp().getRequest<Request>()
      throw new ForbiddenException(
        new ApiErrorResponse(
          HttpStatus.FORBIDDEN,
          'ForbiddenError',
          `Required role(s): ${requiredRoles.join(', ')}. Your role: ${userRole}`,
          request.url,
        ),
      )
    }

    return true
  }
}
