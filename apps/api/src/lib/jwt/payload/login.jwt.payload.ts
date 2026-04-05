import { UserRoleType } from '@solverse/domain'

export type LoginJwtPayload = {
  userId: string
  role: UserRoleType
}
