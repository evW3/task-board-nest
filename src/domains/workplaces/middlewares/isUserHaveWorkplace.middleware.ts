import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WorkplacesService } from '../workplaces.service';
import { Workplaces } from '../workplaces.model';
import { Users } from '../../users/users.model';

@Injectable()
export class IsUserHaveWorkplaceMiddleware implements NestMiddleware {
  constructor(private readonly workplacesService: WorkplacesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      let workplaceId: number;
      if(req?.params?.workplaceId)
        workplaceId = Number.parseInt(req?.params?.workplaceId);
      else
        workplaceId = Number.parseInt(req?.params[0].split('/').reverse()[0]);

      if (!workplaceId) {
        next(new HttpException('WorkplaceId Can`t be undefined', HttpStatus.BAD_REQUEST));
        return;
      }

      const userId = req?.body?.userId;
      const workplaceEntity = new Workplaces();
      const userEntity = new Users();

      workplaceEntity.id = workplaceId;
      userEntity.id = userId;
      workplaceEntity.user = userEntity;

      const isExists = await this.workplacesService.isExistsWorkplace(workplaceEntity);

      if(isExists)
        next();
      else
        next(new HttpException('Can`t find workplace', HttpStatus.BAD_REQUEST));
    } catch (e) {
      console.log(e);
      if(e instanceof HttpException)
        next(e);
      else
        next(new HttpException(e.message, HttpStatus.BAD_REQUEST));
    }
  }
}