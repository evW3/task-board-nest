import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Req } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsDto } from './dto/lists.dto';
import { Lists } from './lists.model';
import { Projects } from '../projects/projects.model';
import { Request } from 'express';
import { getManager } from 'typeorm';
import { PositionQueriesService } from './positionQueries.service';

@Controller()
export class ListsController {
  constructor(private readonly listsService: ListsService,
              private readonly positionQueriesService: PositionQueriesService) {}

  @Post('/')
  async createList(@Body() listsDto: ListsDto, @Param('projectId') projectId: number) {
    try {
      const listEntity = new Lists();
      const projectsEntity = new Projects();
      const lastPosition = (await this.positionQueriesService.getMaxOrMinPosition('projects', projectId, 'lists', 'MAX'))[0].position || 0;

      projectsEntity.id = projectId;
      listEntity.name = listsDto.name;
      listEntity.position = lastPosition + 1;
      listEntity.project = projectsEntity;

      return await this.listsService.saveList(listEntity);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/')
  async getLists(@Param('projectId') projectId: number) {
    try {
      const projectEntity = new Projects();

      projectEntity.id = projectId;

      return await this.listsService.getLists(projectEntity);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('/:listId')
  async deleteList(@Param('listId') listId: number) {
    try {
       const listEntity = new Lists();

       listEntity.id = listId;

       await this.listsService.deleteList(listEntity);

       return { message: 'List was deleted', status: HttpStatus.OK };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('/:listId/swap-list')
  async swapList(@Body('positionToSwap') positionToSwap: number, @Param('listId') listId: number) {
    try {
      const listEntityMoveTo = await getManager().findOne(Lists, listId);
      let listEntityMoveFrom = new Lists();

      listEntityMoveFrom.position = positionToSwap;
      listEntityMoveFrom = await this.listsService.getList(listEntityMoveFrom);

      if(listEntityMoveFrom)
        listEntityMoveFrom.position = listEntityMoveTo.position;
      listEntityMoveTo.position = positionToSwap;

      return await this.listsService.bulkSaveLists([listEntityMoveFrom, listEntityMoveTo]);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('/:listId/change-list-position')
  async changeListPosition(@Body('newPosition') newPosition: number, @Param('listId') listId: number, @Req() req: Request) {
    try {
      const listEntity = await getManager().findOne(Lists, listId);
      const projectId = Number.parseInt(req.params.projectId);
      if(newPosition < listEntity.position) {
        await this.positionQueriesService.increaseWith(
          'projects',
          'lists',
          projectId,
          newPosition,
          listEntity.position
        );
      } else {
        await this.positionQueriesService.changePosition(newPosition, 'lists', listEntity.position);
      }
      listEntity.position = newPosition;

      return await this.listsService.updateList(listEntity);
    } catch(e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}