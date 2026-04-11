import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Effect } from 'effect'
import { TimeOffUsecaseFactory } from './usecases/timeoff.usecases.factory'
import { ApiResponse, TimeOffApi, APICONSTANTS } from '@solverse/shared'
import { CreateTimeOffDto } from './dto/create-timeoff.dto'
import { UpdateTimeOffDto } from './dto/update-timeoff.dto'
import { TimeOffMapper } from './mapper/timeoff.mapper'
import {
  CreateTimeOffDoc,
  GetTimeOffsDoc,
  GetTimeOffDoc,
  UpdateTimeOffDoc,
  DeleteTimeOffDoc,
  CancelTimeOffDoc,
} from './docs/entry'

@ApiTags('TimeOff')
@Controller(
  `${APICONSTANTS.BASE_PATHS.BUSINESSES}/:businessId/${APICONSTANTS.BASE_PATHS.TIMEOFF}`,
)
export class TimeOffController {
  constructor(
    private readonly timeOffUsecaseFactory: TimeOffUsecaseFactory,
    private readonly timeOffMapper: TimeOffMapper,
  ) {}

  @Post(APICONSTANTS.ROUTES.TIMEOFF.CREATE)
  @HttpCode(HttpStatus.CREATED)
  @CreateTimeOffDoc()
  public async create(
    @Param('businessId') businessId: string,
    @Body() body: CreateTimeOffDto,
  ): Promise<ApiResponse<TimeOffApi.CreateTimeOff.Response>> {
    const result = await Effect.runPromise(
      this.timeOffUsecaseFactory.createTimeOffUsecase.execute({
        businessId,
        label: body.label,
        allDay: body.allDay,
        cadence: body.cadence,
        startDate: body.startDate,
        endDate: body.endDate,
        startTime: body.startTime,
        endTime: body.endTime,
        actorId: null, // TODO: Get from auth context
      }),
    )

    return ApiResponse.created(result)
  }

  @Get(APICONSTANTS.ROUTES.TIMEOFF.GET_ALL)
  @HttpCode(HttpStatus.OK)
  @GetTimeOffsDoc()
  public async findAll(
    @Param('businessId') businessId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: 'active' | 'cancelled',
  ): Promise<ApiResponse<TimeOffApi.GetTimeOffs.Response>> {
    const result = await Effect.runPromise(
      this.timeOffUsecaseFactory.getTimeOffsByBusinessUsecase.execute({
        businessId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status,
      }),
    )

    return ApiResponse.ok(
      result.map((timeOff) => this.timeOffMapper.toApi(timeOff)),
    )
  }

  @Get(APICONSTANTS.ROUTES.TIMEOFF.GET_BY_ID)
  @HttpCode(HttpStatus.OK)
  @GetTimeOffDoc()
  public async findOne(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
  ): Promise<ApiResponse<TimeOffApi.GetTimeOff.Response>> {
    const result = await Effect.runPromise(
      this.timeOffUsecaseFactory.getTimeOffUsecase.execute({
        businessId,
        id,
      }),
    )

    if (result._tag === 'None') {
      // TODO: Return proper error response
      throw new Error('Time off not found')
    }

    return ApiResponse.ok(this.timeOffMapper.toApi(result.value))
  }

  @Put(APICONSTANTS.ROUTES.TIMEOFF.UPDATE)
  @HttpCode(HttpStatus.OK)
  @UpdateTimeOffDoc()
  public async update(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Body() body: UpdateTimeOffDto,
  ): Promise<ApiResponse<void>> {
    await Effect.runPromise(
      this.timeOffUsecaseFactory.updateTimeOffUsecase.execute({
        businessId,
        id,
        label: body.label,
        startDate: body.startDate,
        endDate: body.endDate,
        startTime: body.startTime,
        endTime: body.endTime,
        actorId: null, // TODO: Get from auth context
      }),
    )

    return ApiResponse.ok(undefined)
  }

  @Delete(APICONSTANTS.ROUTES.TIMEOFF.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteTimeOffDoc()
  public async delete(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
  ): Promise<ApiResponse<void>> {
    await Effect.runPromise(
      this.timeOffUsecaseFactory.deleteTimeOffUsecase.execute({
        businessId,
        id,
        actorId: null, // TODO: Get from auth context
      }),
    )

    return ApiResponse.ok(undefined)
  }

  @Post(APICONSTANTS.ROUTES.TIMEOFF.CANCEL)
  @HttpCode(HttpStatus.OK)
  @CancelTimeOffDoc()
  public async cancel(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
  ): Promise<ApiResponse<void>> {
    await Effect.runPromise(
      this.timeOffUsecaseFactory.cancelTimeOffUsecase.execute({
        businessId,
        id,
        actorId: null, // TODO: Get from auth context
      }),
    )

    return ApiResponse.ok(undefined)
  }
}
