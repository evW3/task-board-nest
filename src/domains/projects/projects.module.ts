import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from './projects.model';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { IsProjectNotExistsMiddleware } from './middlewares/isProjectNotExists.middleware';
import { IsProjectExistsMiddleware } from './middlewares/isProjectExists.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Projects])
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService]
})
export class ProjectsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(IsProjectNotExistsMiddleware)
      .forRoutes({ path: '**/projects', method: RequestMethod.POST });
    consumer
      .apply(IsProjectExistsMiddleware)
      .forRoutes({ path: '**/projects/:projectId**', method: RequestMethod.ALL });
  }

}