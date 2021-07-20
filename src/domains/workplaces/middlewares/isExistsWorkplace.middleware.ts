import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WorkplacesService } from '../workplaces.service';
import { Workplaces } from '../workplaces.model';

@Injectable()
export class IsExistsWorkplaceMiddleware implements NestMiddleware {
  constructor(private readonly workplacesService: WorkplacesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const workplaceId = Number.parseInt(req?.params?.workplaceId);
      const workplaceEntity = new Workplaces();

      workplaceEntity.id = workplaceId;

      const isExistWorkplace = await this.workplacesService.isExistsWorkplace(workplaceEntity);

      if(isExistWorkplace)     
        next();
      else
        next(new HttpException('Can`t find workplace', HttpStatus.BAD_REQUEST));
    } catch (e) {
      if(e instanceof HttpException)
        next(e);
      else
        next(new HttpException(e.message, HttpStatus.BAD_REQUEST));
    }
  }
}