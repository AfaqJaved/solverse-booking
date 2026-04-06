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
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Effect } from 'effect'
import { ServiceUsecasesFactory } from './usecases/service.usecases.factory'
import { CreateServiceDto } from './dto/create-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'
import { ActivateServiceDto } from './dto/activate-service.dto'
import { DeactivateServiceDto } from './dto/deactivate-service.dto'
import { DeleteServiceDto } from './dto/delete-service.dto'
import { ApiResponse, ServiceApi } from '@solverse/shared'
import { CreateServiceDoc } from './docs/create-service.doc'
import { GetServiceDoc } from './docs/get-service.doc'
import { GetServicesByBusinessDoc } from './docs/get-services-by-business.doc'
import { UpdateServiceDoc } from './docs/update-service.doc'
import { ActivateServiceDoc } from './docs/activate-service.doc'
import { DeactivateServiceDoc } from './docs/deactivate-service.doc'
import { DeleteServiceDoc } from './docs/delete-service.doc'
import { ServiceMapper } from './mapper/service.mapper'
import { RoleGuard } from '../security/role.guard'
import { Roles } from '../security/decorator/roles.decorator'

@ApiTags('Services')
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceUsecaseFactory: ServiceUsecasesFactory) {}

  @Post()
  @CreateServiceDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner')
  public async createService(
    @Body() body: CreateServiceDto,
  ): Promise<ApiResponse<ServiceApi.Create.Response>> {
    const result = await Effect.runPromise(
      this.serviceUsecaseFactory.createServiceUsecase.execute({
        id: crypto.randomUUID(),
        businessId: body.businessId,
        name: body.name,
        duration: body.duration,
        price: body.price,
        createdBy: body.createdBy,
        description: body.description,
        bufferTime: body.bufferTime,
        color: body.color,
        maxBookingsPerSlot: body.maxBookingsPerSlot,
        status: body.status,
      }),
    )
    return ApiResponse.created(ServiceMapper.serviceAggregateToCreateResponse(result))
  }

  @Get(':serviceId')
  @GetServiceDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner', 'superAdmin')
  public async getService(
    @Param('serviceId') serviceId: string,
  ): Promise<ApiResponse<ServiceApi.GetService.Response>> {
    const service = await Effect.runPromise(
      this.serviceUsecaseFactory.getServiceUsecase.execute({ serviceId }),
    )
    return ApiResponse.ok(ServiceMapper.serviceAggregateToGetResponse(service))
  }

  @Get('business/:businessId')
  @GetServicesByBusinessDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner', 'superAdmin')
  public async getServicesByBusiness(
    @Param('businessId') businessId: string,
  ): Promise<ApiResponse<ServiceApi.GetServicesByBusiness.Response>> {
    const services = await Effect.runPromise(
      this.serviceUsecaseFactory.getServicesByBusinessUsecase.execute({ businessId }),
    )
    return ApiResponse.ok(ServiceMapper.serviceAggregatesToGetByBusinessResponse(services))
  }

  @Patch(':serviceId')
  @HttpCode(HttpStatus.OK)
  @UpdateServiceDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner')
  public async updateService(
    @Param('serviceId') serviceId: string,
    @Body() body: UpdateServiceDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.serviceUsecaseFactory.updateServiceUsecase.execute({
        serviceId,
        updatedBy: body.updatedBy,
        name: body.name,
        description: body.description,
        duration: body.duration,
        bufferTime: body.bufferTime,
        price: body.price,
        color: body.color,
        maxBookingsPerSlot: body.maxBookingsPerSlot,
      }),
    )
    return ApiResponse.ok(null)
  }

  @Patch(':serviceId/activate')
  @HttpCode(HttpStatus.OK)
  @ActivateServiceDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner')
  public async activateService(
    @Param('serviceId') serviceId: string,
    @Body() body: ActivateServiceDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.serviceUsecaseFactory.activateServiceUsecase.execute({
        serviceId,
        updatedBy: body.updatedBy,
      }),
    )
    return ApiResponse.ok(null)
  }

  @Patch(':serviceId/deactivate')
  @HttpCode(HttpStatus.OK)
  @DeactivateServiceDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner')
  public async deactivateService(
    @Param('serviceId') serviceId: string,
    @Body() body: DeactivateServiceDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.serviceUsecaseFactory.deactivateServiceUsecase.execute({
        serviceId,
        updatedBy: body.updatedBy,
      }),
    )
    return ApiResponse.ok(null)
  }

  @Delete(':serviceId')
  @HttpCode(HttpStatus.OK)
  @DeleteServiceDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner')
  public async deleteService(
    @Param('serviceId') serviceId: string,
    @Body() body: DeleteServiceDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.serviceUsecaseFactory.deleteServiceUsecase.execute({
        serviceId,
        deletedBy: body.deletedBy,
      }),
    )
    return ApiResponse.ok(null)
  }
}