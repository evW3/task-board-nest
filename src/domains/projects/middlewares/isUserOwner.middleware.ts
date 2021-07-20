import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersQueryRunnerService } from '../../users/usersQueryRunner.service';

@Injectable()
export class IsUserOwnerMiddleware implements NestMiddleware {
  constructor(private readonly usersQueryRunnerService: UsersQueryRunnerService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.body?.userId;
      const projectId = Number.parseInt(req?.params.projectId);
      const isUserOwner = this.usersQueryRunnerService.getProjectOwner(userId, projectId);

      if(isUserOwner)
        next();
      else
        next(new HttpException('Can`t find project', HttpStatus.BAD_REQUEST));
    } catch (e) {
      if(e instanceof HttpException)
        next(e);
      else
        next(new HttpException(e.message, HttpStatus.BAD_REQUEST));
    }
  }
}