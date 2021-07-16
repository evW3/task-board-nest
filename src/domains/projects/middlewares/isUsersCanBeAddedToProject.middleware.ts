import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ProjectsMembersService } from '../projectsMembers.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class IsUsersCanBeAddedToProjectMiddleware implements NestMiddleware {
  constructor(private readonly projectsMembersService: ProjectsMembersService,
              private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req?.body?.userEmail;
      const userEntity = await this.usersService.findUserByEmail(userEmail);
      const projectId = Number.parseInt(req?.params?.projectId);
      let isUserCanBeAdded = true;
      const usersProjects = await this.projectsMembersService.getProjectsByUserId(userEntity.id);

      for(let project of usersProjects) {
        if(project.id === projectId) {
          isUserCanBeAdded = false
          break;
        }
      }

      if(isUserCanBeAdded)
        next();
      else
        next(new HttpException('This user can`t be added', HttpStatus.BAD_REQUEST));
    } catch (e) {
      if(e instanceof HttpException)
        next(e);
      else
        next(new HttpException(e.message, HttpStatus.BAD_REQUEST));
    }
  }
}