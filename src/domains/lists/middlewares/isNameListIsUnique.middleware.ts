import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ListsService } from '../lists.service';
import { Lists } from '../lists.model';
import { Projects } from '../../projects/projects.model';

@Injectable()
export class IsNameListIsUniqueMiddleware implements NestMiddleware {
  constructor(private readonly listsService: ListsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = Number?.parseInt(req?.params[0]?.split('/')?.reverse()[0]);
      const name = req?.body?.name;
      const listEntity = new Lists();
      const projectEntity = new Projects();

      projectEntity.id = projectId;
      listEntity.project = projectEntity;
      listEntity.name = name;

      const isExists = await this.listsService.isListExists(listEntity);

      if(!isExists)
        next();
      else
        next(new HttpException('List with this name already exists', HttpStatus.BAD_REQUEST));
    } catch (e) {
      console.log(e);
      if(e instanceof HttpException)
        next(e);
      else
        next(new HttpException(e.message, HttpStatus.BAD_REQUEST));
    }
  }
}