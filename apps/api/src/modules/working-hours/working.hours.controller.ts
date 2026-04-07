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
import { WorkingHoursUsecasesFactory } from './usecases/working.hours.usecases.factory'
import { CreateWorkingHoursDto } from './dto/create-working-hours.dto'
import { UpdateWorkingHoursDto } from './dto/update-working-hours.dto'
import { DeleteWorkingHoursDto } from './dto/delete-working-hours.dto'
import { ApiResponse, WorkingHoursApi } from '@solverse/shared'
import { CreateWorkingHoursDoc } from './docs/create-working-hours.doc'
import { GetWorkingHoursDoc } from './docs/get-working-hours.doc'
import { ListWorkingHoursByBusinessDoc } from './docs/list-working-hours-by-business.doc'
import { UpdateWorkingHoursDoc } from './docs/update-working-hours.doc'
import { DeleteWorkingHoursDoc } from './docs/delete-working-hours.doc'
import { WorkingHoursMapper } from './mapper/working.hours.mapper'
import { RoleGuard } from '../security/role.guard'
import { Roles } from '../security/decorator/roles.decorator'

@ApiTags('Working Hours')
@Controller('working-hours')
export class WorkingHoursController {
  constructor(
    private readonly workingHoursUsecaseFactory: WorkingHoursUsecasesFactory,
  ) {}

  @Post()
  @CreateWorkingHoursDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner')
  public async createWorkingHours(
    @Body() body: CreateWorkingHoursDto,
  ): Promise<ApiResponse<WorkingHoursApi.Create.Response>> {
    const result = await Effect.runPromise(
      this.workingHoursUsecaseFactory.createWorkingHoursUsecase.execute({
        id: crypto.randomUUID(),
        businessId: body.businessId,
        dayOfWeek: body.dayOfWeek,
        isOpen: body.isOpen,
        openTime: body.openTime,
        closeTime: body.closeTime,
        createdBy: body.createdBy,
      }),
    )
    return ApiResponse.created(
      WorkingHoursMapper.workingHoursAggregateToCreateResponse(result),
    )
  }

  @Get(':workingHoursId')
  @GetWorkingHoursDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner', 'superAdmin')
  public async getWorkingHours(
    @Param('workingHoursId') workingHoursId: string,
  ): Promise<ApiResponse<WorkingHoursApi.GetWorkingHours.Response>> {
    const workingHours = await Effect.runPromise(
      this.workingHoursUsecaseFactory.getWorkingHoursUsecase.execute({
        id: workingHoursId,
      }),
    )
    return ApiResponse.ok(
      WorkingHoursMapper.workingHoursAggregateToGetResponse(workingHours),
    )
  }

  @Get('business/:businessId')
  @ListWorkingHoursByBusinessDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner', 'superAdmin')
  public async listWorkingHoursByBusiness(
    @Param('businessId') businessId: string,
  ): Promise<ApiResponse<WorkingHoursApi.ListWorkingHoursByBusiness.Response>> {
    const workingHours = await Effect.runPromise(
      this.workingHoursUsecaseFactory.listWorkingHoursByBusinessUsecase.execute(
        { businessId },
      ),
    )
    return ApiResponse.ok(
      WorkingHoursMapper.workingHoursAggregatesToListResponse(workingHours),
    )
  }

  @Patch(':workingHoursId')
  @HttpCode(HttpStatus.OK)
  @UpdateWorkingHoursDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner')
  public async updateWorkingHours(
    @Param('workingHoursId') workingHoursId: string,
    @Body() body: UpdateWorkingHoursDto,
  ): Promise<ApiResponse<WorkingHoursApi.GetWorkingHours.Response>> {
    const result = await Effect.runPromise(
      this.workingHoursUsecaseFactory.updateWorkingHoursUsecase.execute({
        id: workingHoursId,
        isOpen: body.isOpen,
        openTime: body.openTime,
        closeTime: body.closeTime,
        updatedBy: body.updatedBy,
      }),
    )
    return ApiResponse.ok(
      WorkingHoursMapper.workingHoursAggregateToGetResponse(result),
    )
  }

  @Delete(':workingHoursId')
  @HttpCode(HttpStatus.OK)
  @DeleteWorkingHoursDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner')
  public async deleteWorkingHours(
    @Param('workingHoursId') workingHoursId: string,
    @Body() body: DeleteWorkingHoursDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.workingHoursUsecaseFactory.deleteWorkingHoursUsecase.execute({
        id: workingHoursId,
        deletedBy: body.deletedBy,
      }),
    )
    return ApiResponse.ok(null)
  }
}
