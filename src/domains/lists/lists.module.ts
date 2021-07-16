import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lists } from './lists.model';
import { IsNameListIsUniqueMiddleware } from './middlewares/isNameListIsUnique.middleware';
import { IsListExistsMiddleware } from './middlewares/isListExists.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lists])
  ],
  controllers: [ListsController],
  providers: [ListsService]
})
export class ListsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(IsNameListIsUniqueMiddleware)
      .forRoutes(
        { path: '**/lists$', method: RequestMethod.POST }
        )
    consumer
      .apply(IsListExistsMiddleware)
      .forRoutes(
        { path: '**/:listId$', method: RequestMethod.DELETE }
      )
  }
}