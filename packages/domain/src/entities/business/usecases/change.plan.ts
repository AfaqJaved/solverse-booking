import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import {
  BusinessDeletedError,
  BusinessNotFoundError,
  BusinessSuspendedError,
} from '../errors/entry'
import { BusinessPlanType } from '../value-objects/business.plan'

export const IChangePlanUsecase = Symbol('IChangePlanUsecase')

export interface ChangePlanUsecase {
  execute(params: {
    businessId: string
    plan: BusinessPlanType
    actorId: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | BusinessNotFoundError
    | BusinessSuspendedError
    | BusinessDeletedError
    | DatabaseFailure
  >
}
