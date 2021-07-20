import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Lists } from '../lists.model';
import { PositionQueriesService } from '../positionQueries.service';
import { getManager } from 'typeorm';

@Injectable()
export class IsCanMoveListMiddleware implements NestMiddleware {
  constructor(private readonly positionQueriesService: PositionQueriesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const newPosition = req.body.newPosition;
      const pathArr = req.params[0].split('/');
      const idxLists = pathArr.findIndex((str: any) => str === 'lists');
      const idxProjects = pathArr.findIndex((str: any) => str === 'projects');
      const listId = pathArr[idxLists + 1];
      const projectId = Number.parseInt(pathArr[idxProjects + 1]);
      const listEntity = await getManager().findOne(Lists, listId);
      const lastPosition = (await this.positionQueriesService.getMaxPosition('projects', projectId, 'lists'))[0].position;

      if((lastPosition >= newPosition) && listEntity.position != newPosition)
        next();
      else
        next(new HttpException('Can`t move list', HttpStatus.BAD_REQUEST));
    } catch (e) {
      if(e instanceof HttpException)
        next(e);
      else
        next(new HttpException(e.message, HttpStatus.BAD_REQUEST));
    }
  }
}