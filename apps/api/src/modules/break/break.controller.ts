import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Effect } from 'effect'
import { BreakUsecasesFactory } from './usecases/break.usecases.factory'
import { CreateBreakDto } from './dto/create-break.dto'
import { UpdateBreakTimesDto } from './dto/update-break-times.dto'
import { DeleteBreakDto } from './dto/delete-break.dto'
import { ApiResponse, BreakApi, APICONSTANTS } from '@solverse/shared'
import { CreateBreakDoc } from './docs/create-break.doc'
import { GetBreakDoc } from './docs/get-break.doc'
import { GetBreaksByWorkingHoursDoc } from './docs/get-breaks-by-working-hours.doc'
import { UpdateBreakTimesDoc } from './docs/update-break-times.doc'
import { DeleteBreakDoc } from './docs/delete-break.doc'
import { BreakMapper } from './mapper/break.mapper'
import { RoleGuard } from '../security/role.guard'
import { Roles } from '../security/decorator/roles.decorator'

@ApiTags('Breaks')
@Controller(APICONSTANTS.BASE_PATHS.BREAKS)
export class BreakController {
  constructor(private readonly breakUsecaseFactory: BreakUsecasesFactory) {}

  @Post(APICONSTANTS.ROUTES.BREAKS.CREATE)
  @CreateBreakDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner')
  public async createBreak(
    @Body() body: CreateBreakDto,
  ): Promise<ApiResponse<BreakApi.Create.Response>> {
    const result = await Effect.runPromise(
      this.breakUsecaseFactory.createBreakUsecase.execute({
        id: crypto.randomUUID(),
        workingHoursId: body.workingHoursId,
        label: body.label,
        startTime: body.startTime,
        endTime: body.endTime,
        createdBy: body.createdBy,
      }),
    )
    return ApiResponse.created(
      BreakMapper.breakAggregateToCreateResponse(result),
    )
  }

  @Get(APICONSTANTS.ROUTES.BREAKS.GET_BY_ID)
  @GetBreakDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner', 'superAdmin')
  public async getBreak(
    @Param('id') id: string,
  ): Promise<ApiResponse<BreakApi.GetBreak.Response>> {
    const breakEntity = await Effect.runPromise(
      this.breakUsecaseFactory.getBreakUsecase.execute({ breakId: id }),
    )
    return ApiResponse.ok(BreakMapper.breakAggregateToGetResponse(breakEntity))
  }

  @Get(APICONSTANTS.ROUTES.BREAKS.GET_BY_WORKING_HOURS)
  @GetBreaksByWorkingHoursDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner', 'superAdmin')
  public async getBreaksByWorkingHours(
    @Query('workingHoursId') workingHoursId: string,
  ): Promise<ApiResponse<BreakApi.GetBreaksByWorkingHours.Response>> {
    const breaks = await Effect.runPromise(
      this.breakUsecaseFactory.getBreaksByWorkingHoursUsecase.execute({
        workingHoursId,
      }),
    )
    return ApiResponse.ok(
      BreakMapper.breakAggregatesToGetByWorkingHoursResponse(breaks),
    )
  }

  @Patch(APICONSTANTS.ROUTES.BREAKS.UPDATE_TIMES)
  @HttpCode(HttpStatus.OK)
  @UpdateBreakTimesDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner')
  public async updateBreakTimes(
    @Param('id') id: string,
    @Body() body: UpdateBreakTimesDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.breakUsecaseFactory.updateBreakTimesUsecase.execute({
        breakId: id,
        startTime: body.startTime,
        endTime: body.endTime,
        updatedBy: body.updatedBy,
      }),
    )
    return ApiResponse.ok(null)
  }

  @Delete(APICONSTANTS.ROUTES.BREAKS.DELETE)
  @HttpCode(HttpStatus.OK)
  @DeleteBreakDoc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner')
  public async deleteBreak(
    @Param('id') id: string,
    @Body() body: DeleteBreakDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.breakUsecaseFactory.deleteBreakUsecase.execute({
        breakId: id,
        deletedBy: body.deletedBy,
      }),
    )
    return ApiResponse.ok(null)
  }
}
