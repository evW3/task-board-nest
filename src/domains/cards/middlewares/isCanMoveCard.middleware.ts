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
      const listId = req.body.listIdMoveTo;
      const cardId = req.params.cardId;
      const cardEntity = await getManager().findOne(Cards, cardId);
      const lastPosition = (await this.positionQueriesService.getMaxPosition('lists', listId, 'cards'))[0].position || 1;
      
      if((lastPosition >= newPosition) && cardEntity.position != newPosition)
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