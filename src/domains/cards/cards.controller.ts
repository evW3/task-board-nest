import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { CardsService } from './cards.service';
import { Cards } from './cards.model';
import { Lists } from '../lists/lists.model';

@Controller()
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post('/')
  async createCard(@Body() createCardDto: any, @Param('listId') listId: number) {
    try {
      const cardEntity = new Cards();
      const listEntity = new Lists();

      listEntity.id = listId;
      cardEntity.name = createCardDto.name;
      createCardDto.description && (cardEntity.description = createCardDto.description);
      cardEntity.list = listEntity;
      cardEntity.date_interval_from = new Date(createCardDto.date.from);
      cardEntity.date_interval_to = new Date(createCardDto.date.to);

      return await this.cardsService.createCard(cardEntity);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/')
  async getCards(@Param('listId') listId: number) {
    try {
      const listEntity = new Lists();

      listEntity.id = listId;

      return await this.cardsService.getCardsByList(listEntity);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}