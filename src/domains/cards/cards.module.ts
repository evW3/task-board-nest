import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cards } from './cards.model';
import { CardsActivities } from './cardsActivities.model';
import { CardsAttachments } from './cardsAttachments.model';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { IsCardMemberMiddleware } from './middlewares/isCardMember.middleware';
import { CardsMembersService } from './cardsMembers.service';
import { IsListIdMoveToExistsMiddleware } from './middlewares/isListIdMoveToExists.middleware';
import { ListsModule } from '../lists/lists.module';
import { CardsActivitiesService } from './cardsActivities.service';
import { IsCanMoveCardMiddleware } from './middlewares/isCanMoveCard.middleware';

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
        { path: '**/cards/:cardId$', method: RequestMethod.ALL }
      );
    consumer
      .apply(IsListIdMoveToExistsMiddleware)
      .forRoutes(
        { path: '**/cards/move-all', method: RequestMethod.PATCH }
      );
    consumer
      .apply(IsCanMoveCardMiddleware)
      .forRoutes(
        { path: '**/:cardId/change-card-position', method: RequestMethod.PATCH }
      )
  }

}