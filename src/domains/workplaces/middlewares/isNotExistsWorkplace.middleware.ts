import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WorkplacesService } from '../workplaces.service';
import { Workplaces } from '../workplaces.model';
import { Users } from '../../users/users.model';

@Injectable()
export class IsNotExistsWorkplaceMiddleware implements NestMiddleware {
  constructor(private readonly workplacesService: WorkplacesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const workplaceName = req?.body?.name;
      const workplaceEntity = new Workplaces();
      const userId = req?.body?.userId;
      const userEntity = new Users()

      workplaceEntity.name = workplaceName;
      userEntity.id = userId;
      workplaceEntity.user = userEntity;

      const isExists = await this.workplacesService.isExistsWorkplace(workplaceEntity);

      if(!isExists)
        next();
      else
        next(new HttpException('Workplace with this name already exists', HttpStatus.BAD_REQUEST));
    } catch (e) {
      if(e instanceof HttpException)
        next(e);
      else
        next(new HttpException(e.message, HttpStatus.BAD_REQUEST));
    }
  }
}