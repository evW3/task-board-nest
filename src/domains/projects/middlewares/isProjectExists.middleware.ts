import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ProjectsService } from '../projects.service';
import { Projects } from '../projects.model';
import { ProjectsMembersService } from '../projectsMembers.service';

@Injectable()
export class IsProjectExistsMiddleware implements NestMiddleware {
  constructor(private readonly projectsService: ProjectsService,
              private readonly projectsMembersService: ProjectsMembersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = Number.parseInt(req?.params?.projectId);
      const projectEntity = new Projects();
      const userId = req?.body?.userId;
      projectEntity.id = projectId;

      const isExistProject = await this.projectsMembersService.isExistsMember(projectId, userId);

      if(isExistProject.length === 1)
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