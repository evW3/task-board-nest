import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsDto } from './dto/lists.dto';
import { Lists } from './lists.model';
import { Projects } from '../projects/projects.model';

@Controller()
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post('/')
  async createList(@Body() listsDto: ListsDto, @Param('projectId') projectId: number) {
    try {
      const listEntity = new Lists();
      const projectsEntity = new Projects();

      projectsEntity.id = projectId;
      listEntity.name = listsDto.name;

      if(listsDto.position)
        listEntity.position = listsDto.position;

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
}