import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Effect } from 'effect'
import { BusinessUsecasesFactory } from './usecases/entry'
import { RegisterBusinessDto } from './dto/register-business.dto'
import { UpdateBusinessProfileDto } from './dto/update-profile.dto'
import { UpdateBusinessSlugDto } from './dto/update-slug.dto'
import { ChangePlanDto } from './dto/change-plan.dto'
import { SuspendBusinessDto } from './dto/suspend-business.dto'
import { ActorDto } from './dto/actor.dto'
import { ApiResponse, BusinessApi } from '@solverse/shared'
import { RegisterBusinessDoc } from './docs/register-business.doc'
import { GetBusinessDoc } from './docs/get-business.doc'
import { GetBusinessesByOwnerDoc } from './docs/get-businesses-by-owner.doc'
import { UpdateBusinessProfileDoc } from './docs/update-profile.doc'
import { UpdateBusinessSlugDoc } from './docs/update-slug.doc'
import { ChangePlanDoc } from './docs/change-plan.doc'
import { ActivateBusinessDoc } from './docs/activate-business.doc'
import { DeactivateBusinessDoc } from './docs/deactivate-business.doc'
import { ReactivateBusinessDoc } from './docs/reactivate-business.doc'
import { SuspendBusinessDoc } from './docs/suspend-business.doc'
import { DeleteBusinessDoc } from './docs/delete-business.doc'
import { BusinessMapper } from './mapper/business.mapper'

@ApiTags('Businesses')
@Controller('businesses')
export class BusinessController {
  constructor(
    private readonly businessUsecasesFactory: BusinessUsecasesFactory,
  ) {}

  @Post()
  @RegisterBusinessDoc()
  public async register(
    @Body() body: RegisterBusinessDto,
  ): Promise<ApiResponse<BusinessApi.Register.Response>> {
    const result = await Effect.runPromise(
      this.businessUsecasesFactory.registerBusinessUsecase.execute({
        ownerId: body.ownerId,
        name: body.name,
        slug: body.slug,
        email: body.email,
        timezone: body.timezone,
        currency: body.currency,
        phone: body.phone,
        plan: body.plan,
      }),
    )
    return ApiResponse.created(result)
  }

  @Get('owner/:ownerId')
  @GetBusinessesByOwnerDoc()
  public async getByOwner(
    @Param('ownerId') ownerId: string,
  ): Promise<ApiResponse<BusinessApi.GetBusiness.Response[]>> {
    const businesses = await Effect.runPromise(
      this.businessUsecasesFactory.getBusinessesByOwnerUsecase.execute({
        ownerId,
      }),
    )
    return ApiResponse.ok(businesses.map(BusinessMapper.toResponse))
  }

  @Get(':businessId')
  @GetBusinessDoc()
  public async getById(
    @Param('businessId') businessId: string,
  ): Promise<ApiResponse<BusinessApi.GetBusiness.Response>> {
    const business = await Effect.runPromise(
      this.businessUsecasesFactory.getBusinessUsecase.execute({ businessId }),
    )
    return ApiResponse.ok(BusinessMapper.toResponse(business))
  }

  @Patch(':businessId/profile')
  @HttpCode(HttpStatus.OK)
  @UpdateBusinessProfileDoc()
  public async updateProfile(
    @Param('businessId') businessId: string,
    @Body() body: UpdateBusinessProfileDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.businessUsecasesFactory.updateBusinessProfileUsecase.execute({
        businessId,
        actorId: body.actorId,
        name: body.name,
        description: body.description,
        website: body.website,
        logoUrl: body.logoUrl,
        phone: body.phone,
        timezone: body.timezone,
        email: body.email,
        currency: body.currency,
      }),
    )
    return ApiResponse.ok(null)
  }

  @Patch(':businessId/slug')
  @HttpCode(HttpStatus.OK)
  @UpdateBusinessSlugDoc()
  public async updateSlug(
    @Param('businessId') businessId: string,
    @Body() body: UpdateBusinessSlugDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.businessUsecasesFactory.updateBusinessSlugUsecase.execute({
        businessId,
        slug: body.slug,
        actorId: body.actorId,
      }),
    )
    return ApiResponse.ok(null)
  }

  @Patch(':businessId/plan')
  @HttpCode(HttpStatus.OK)
  @ChangePlanDoc()
  public async changePlan(
    @Param('businessId') businessId: string,
    @Body() body: ChangePlanDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.businessUsecasesFactory.changePlanUsecase.execute({
        businessId,
        plan: body.plan,
        actorId: body.actorId,
      }),
    )
    return ApiResponse.ok(null)
  }

  @Patch(':businessId/activate')
  @HttpCode(HttpStatus.OK)
  @ActivateBusinessDoc()
  public async activate(
    @Param('businessId') businessId: string,
    @Body() body: ActorDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.businessUsecasesFactory.activateBusinessUsecase.execute({
        businessId,
        actorId: body.actorId,
      }),
    )
    return ApiResponse.ok(null)
  }

  @Patch(':businessId/deactivate')
  @HttpCode(HttpStatus.OK)
  @DeactivateBusinessDoc()
  public async deactivate(
    @Param('businessId') businessId: string,
    @Body() body: ActorDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.businessUsecasesFactory.deactivateBusinessUsecase.execute({
        businessId,
        actorId: body.actorId,
      }),
    )
    return ApiResponse.ok(null)
  }

  @Patch(':businessId/reactivate')
  @HttpCode(HttpStatus.OK)
  @ReactivateBusinessDoc()
  public async reactivate(
    @Param('businessId') businessId: string,
    @Body() body: ActorDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.businessUsecasesFactory.reactivateBusinessUsecase.execute({
        businessId,
        actorId: body.actorId,
      }),
    )
    return ApiResponse.ok(null)
  }

  @Patch(':businessId/suspend')
  @HttpCode(HttpStatus.OK)
  @SuspendBusinessDoc()
  public async suspend(
    @Param('businessId') businessId: string,
    @Body() body: SuspendBusinessDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.businessUsecasesFactory.suspendBusinessUsecase.execute({
        businessId,
        reason: body.reason,
        actorId: body.actorId,
      }),
    )
    return ApiResponse.ok(null)
  }

  @Delete(':businessId')
  @HttpCode(HttpStatus.OK)
  @DeleteBusinessDoc()
  public async delete(
    @Param('businessId') businessId: string,
    @Body() body: ActorDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.businessUsecasesFactory.deleteBusinessUsecase.execute({
        businessId,
        actorId: body.actorId,
      }),
    )
    return ApiResponse.ok(null)
  }
}
