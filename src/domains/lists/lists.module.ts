import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lists } from './lists.model';
import { IsNameListIsUniqueMiddleware } from './middlewares/isNameListIsUnique.middleware';
import { IsListExistsMiddleware } from './middlewares/isListExists.middleware';
import { PositionQueriesService } from './positionQueries.service';
import { IsCanMoveListMiddleware } from './middlewares/isCanMoveList.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lists])
  ],
  controllers: [ListsController],
  providers: [ListsService, PositionQueriesService],
  exports: [ListsService, PositionQueriesService]
})
export class ListsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(IsNameListIsUniqueMiddleware)
      .forRoutes(
        { path: '**/lists$', method: RequestMethod.POST }
      );
    consumer
      .apply(IsListExistsMiddleware)
      .forRoutes(
        { path: '**/lists/:listId$', method: RequestMethod.DELETE }
      );
    consumer
      .apply(IsCanMoveListMiddleware)
      .forRoutes(
        { path: '**/lists/:listId/change-list-position$', method: RequestMethod.PATCH }
      );
  }
}