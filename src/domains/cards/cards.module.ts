import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cards } from './cards.model';
import { CardsActivity } from './cardsActivity.model';
import { CardsAttachments } from './cardsAttachments.model';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cards, CardsActivity, CardsAttachments])
  ],
  controllers: [CardsController],
  providers: [CardsService]
})
export class CardsModule {

}