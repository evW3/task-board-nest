import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ProjectsService } from '../projects.service';
import { Projects } from '../projects.model';

@Injectable()
export class IsProjectExistsMiddleware implements NestMiddleware {
  constructor(private readonly projectsService: ProjectsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = Number.parseInt(req?.params?.projectId);
      console.log(req?.params);
      const projectEntity = new Projects();

      projectEntity.id = projectId;

      const isExistProject = await this.projectsService.isExistsProjects(projectEntity);

      if(isExistProject)
        next();
      else
        next(new HttpException('Can`t find project', HttpStatus.BAD_REQUEST));
    } catch (e) {
      console.log(e);
      if(e instanceof HttpException)
        next(e);
      else
        next(new HttpException(e.message, HttpStatus.BAD_REQUEST));
    }
  }
}