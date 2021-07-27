import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PositionQueriesService } from '../../lists/positionQueries.service';
import { getManager } from 'typeorm';
import { Cards } from '../cards.model';

@Injectable()
export class IsCanMoveCardMiddleware implements NestMiddleware {
  constructor(private readonly positionQueriesService: PositionQueriesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const newPosition = req.body.newPosition;
      const pathArr = req.params[0].split('/');
      const idxLists = pathArr.findIndex((str: any) => str === 'lists');
      const cardListId = pathArr[idxLists + 1];
      const listId = req.body.listIdMoveTo;
      const cardId = req.params.cardId;
      const cardEntity = await getManager().findOne(Cards, cardId);
      const lastPosition = (await this.positionQueriesService.getMaxOrMinPosition('lists', listId, 'cards', 'MAX'))[0].position || 1;
      
      if(((lastPosition + 1) >= newPosition) && (cardEntity.position != newPosition || cardListId != listId))
        next();
      else
        next(new HttpException('Can`t move card', HttpStatus.BAD_REQUEST));
    } catch (e) {
      if(e instanceof HttpException)
        next(e);
      else
        next(new HttpException(e.message, HttpStatus.BAD_REQUEST));
    }
  }
}