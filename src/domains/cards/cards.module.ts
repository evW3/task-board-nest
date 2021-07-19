import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cards } from './cards.model';
import { CardsActivities } from './cardsActivities.model';
import { CardsAttachments } from './cardsAttachments.model';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { IsCardMemberMiddleware } from './middlewares/isCardMember.middleware';
import { CardsMembersService } from './cardsMembers.service';
import { IsListExistsMiddleware } from './middlewares/isListExists.middleware';
import { ListsModule } from '../lists/lists.module';
import { CardsActivitiesService } from './cardsActivities.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cards, CardsActivities, CardsAttachments]),
    ListsModule
  ],
  controllers: [CardsController],
  providers: [CardsService, CardsMembersService, CardsActivitiesService],
  exports: [CardsMembersService]
})
export class CardsModule implements NestModule{
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(IsCardMemberMiddleware)
      .forRoutes(
        { path: '**/cards/:cardId', method: RequestMethod.ALL }
      );
    consumer
      .apply(IsListExistsMiddleware)
      .forRoutes(
        { path: '**/move', method: RequestMethod.PATCH },
        { path: '**/move-all', method: RequestMethod.PATCH }
      );
  }

}