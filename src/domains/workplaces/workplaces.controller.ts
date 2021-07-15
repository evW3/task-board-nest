import {
  Body,
  Controller,
  Delete, Get,
  HttpException,
  HttpStatus,
  Param, Patch,
  Post,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { WorkplacesService } from './workplaces.service';
import { WorkplaceDto } from './dto/workplace.dto';
import { Workplaces } from './workplaces.model';
import { SchemaValidatePipe } from '../../pipes/schemaValidate.pipe';
import { WorkplaceSchema } from './schemas/workplace.schema';
import { UserExcludePasswordsDataInterceptor } from '../../interceptors/userExcludePasswordsData.interceptor';
import { Users } from '../users/users.model';
import { getManager } from 'typeorm';

@Controller()
export class WorkplacesController {
  constructor(private readonly workplaceService: WorkplacesService) {}

  @Post('/')
  @UseInterceptors(UserExcludePasswordsDataInterceptor)
  @UsePipes(new SchemaValidatePipe(WorkplaceSchema))
  async createWorkplace(@Body() workplaceDto: WorkplaceDto) {
    try {
      const workplaceEntity = new Workplaces();
      const userEntity = new Users();

      userEntity.id = workplaceDto.userId;

      workplaceEntity.name = workplaceDto.name;
      workplaceEntity.user = userEntity;

      return await this.workplaceService.saveWorkplace(workplaceEntity);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/')
  async getWorkplaces(@Body('userId') userId: number) {
    try {
      const userEntity = new Users();

      userEntity.id = userId;

      return await this.workplaceService.getUsersWorkplaces(userEntity);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('/:workplaceId')
  async deleteWorkplace(@Param('workplaceId') workplaceId: number) {
    try {
      const workplaceEntity = new Workplaces();

      workplaceEntity.id = workplaceId;

      await this.workplaceService.deleteWorkplace(workplaceEntity);

      return { message: 'Workplace was deleted!', status: HttpStatus.OK };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('/:workplaceId')
  async updateWorkplace(@Param('workplaceId') workplaceId: number, @Body() workplaceDto: WorkplaceDto) {
    try {
      const workplaceEntity = await getManager().findOne(Workplaces, workplaceId);

      workplaceEntity.name = workplaceDto.name;

      return await this.workplaceService.updateWorkplace(workplaceEntity);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}