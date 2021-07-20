import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Projects } from '../projects.model';
import { ProjectsService } from '../projects.service';
import { Workplaces } from '../../workplaces/workplaces.model';

@Injectable()
export class IsProjectNotExistsMiddleware implements NestMiddleware {
  constructor(private readonly projectsService: ProjectsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('2');
      const projectName = req?.body?.name;
      const projectEntity = new Projects();
      const workplaceId = Number.parseInt(req?.params[0].split('/').reverse()[0]);
      const workplaceEntity = new Workplaces()

      projectEntity.name = projectName;
      workplaceEntity.id = workplaceId;
      projectEntity.workplace = workplaceEntity;

      const isExists = await this.projectsService.isExistsProjects(projectEntity);

      if(!isExists)
        next();
      else
        next(new HttpException('Project with this name already exists', HttpStatus.BAD_REQUEST));
    } catch (e) {
      if(e instanceof HttpException)
        next(e);
      else
        next(new HttpException(e.message, HttpStatus.BAD_REQUEST));
    }
  }
}