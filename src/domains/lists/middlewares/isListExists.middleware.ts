import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ListsService } from '../lists.service';
import { Lists } from '../lists.model';
import { Projects } from '../../projects/projects.model';

@Injectable()
export class IsListExistsMiddleware implements NestMiddleware {
  constructor(private readonly listsService: ListsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
        const listId = Number.parseInt(req?.params?.listId);
        const projectId = Number.parseInt(req.params[0].split('/').reverse().find((str: any) => {
          if (typeof str != "string") return false
          return !isNaN(parseInt(str))
        }));
        const listEntity = new Lists();
        const projectEntity = new Projects();

        projectEntity.id = projectId;
        listEntity.id = listId;
        listEntity.project = projectEntity;

        const isExist = await this.listsService.isListExists(listEntity);
        if(isExist)
          next();
        else
          next(new HttpException('Can`t find list', HttpStatus.BAD_REQUEST));
    } catch (e) {
      if(e instanceof HttpException)
        next(e);
      else
        next(new HttpException(e.message, HttpStatus.BAD_REQUEST));
    }
  }
}