import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { WorkplacesService } from './workplaces.service';
import { WorkplacesController } from './workplaces.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workplaces } from './workplaces.model';
import { TokenMiddleware } from '../../middlewares/token.middleware';
import { AuthModule } from '../auth/auth.module';
import { IsNotExistsWorkplaceMiddleware } from './middlewares/isNotExistsWorkplace.middleware';
import { IsUserHaveWorkplaceMiddleware } from './middlewares/isUserHaveWorkplace.middleware';
import { IsExistsWorkplaceMiddleware } from './middlewares/isExistsWorkplace.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workplaces]),
    AuthModule
  ],
  controllers: [WorkplacesController],
  providers: [WorkplacesService],
  exports: [WorkplacesService]
})
export class WorkplacesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware)
      .forRoutes({ path: '/workplaces', method: RequestMethod.ALL });

    consumer
      .apply(IsNotExistsWorkplaceMiddleware)
      .forRoutes({ path: '/workplaces$', method: RequestMethod.POST });

    consumer
      .apply(IsUserHaveWorkplaceMiddleware)
      .forRoutes(
        { path: '/workplaces/:workplaceId$', method: RequestMethod.ALL }
       );

    consumer
      .apply(IsExistsWorkplaceMiddleware)
      .forRoutes(
        { path: '/workplaces/:workplaceId', method: RequestMethod.ALL }
      );
  }
}