import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from './projects.model';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { IsProjectNotExistsMiddleware } from './middlewares/isProjectNotExists.middleware';
import { IsProjectExistsMiddleware } from './middlewares/isProjectExists.middleware';
import { IsUsersCanBeAddedToProjectMiddleware } from './middlewares/isUsersCanBeAddedToProject.middleware';
import { UsersModule } from '../users/users.module';
import { ProjectsMembersService } from './projectsMembers.service';
import { IsUserHaveWorkplaceMiddleware } from '../workplaces/middlewares/isUserHaveWorkplace.middleware';
import { WorkplacesModule } from '../workplaces/workplaces.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Projects]),
    UsersModule,
    forwardRef(() => WorkplacesModule)
  ],
  providers: [ProjectsService, ProjectsMembersService],
  controllers: [ProjectsController],
  exports: [ProjectsService]
})
export class ProjectsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(IsUserHaveWorkplaceMiddleware)
      .forRoutes(
        { path: '**/projects/$', method: RequestMethod.ALL },
        { path: '**/projects/:projectId/add-member', method: RequestMethod.POST }
       )
    consumer
      .apply(IsProjectNotExistsMiddleware)
      .forRoutes({ path: '**/projects', method: RequestMethod.POST });
    consumer
      .apply(IsProjectExistsMiddleware)
      .forRoutes({ path: '**/projects/:projectId/**', method: RequestMethod.ALL });
    consumer
      .apply(IsUsersCanBeAddedToProjectMiddleware)
      .forRoutes({ path: '**/projects/:projectId/add-member', method: RequestMethod.POST })
  }

}