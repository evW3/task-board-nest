import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ListsService } from '../../lists/lists.service';
import { Lists } from '../../lists/lists.model';


@Injectable()
export class IsListIdMoveToExistsMiddleware implements NestMiddleware {
  constructor(private readonly listsService: ListsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('move-all');
      
      const listIdMoveTo = req?.body?.listIdMoveTo;
      const listEntity = new Lists();

      listEntity.id = listIdMoveTo;

      const isListExists = await this.listsService.isListExists(listEntity);
      if(isListExists)
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