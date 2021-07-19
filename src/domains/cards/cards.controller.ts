import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param, Patch,
  Post, UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { Cards } from './cards.model';
import { Lists } from '../lists/lists.model';
import { CardsMembersService } from './cardsMembers.service';
import { getManager } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { CardsActivities } from './cardsActivities.model';
import { CardsActivitiesService } from './cardsActivities.service';

@Controller()
export class CardsController {
  constructor(private readonly cardsService: CardsService,
              private readonly cardsMembersService: CardsMembersService,
              private readonly cardsActivityService: CardsActivitiesService) {}

  @Post('/')
  async createCard(@Body() createCardDto: any, @Param('listId') listId: number) {
    try {
      const cardEntity = new Cards();
      const listEntity = new Lists();
      const userId = createCardDto.userId;

      listEntity.id = listId;
      cardEntity.name = createCardDto.name;
      createCardDto.description && (cardEntity.description = createCardDto.description);
      cardEntity.list = listEntity;
      cardEntity.date_interval_from = new Date(createCardDto.date.from);
      cardEntity.date_interval_to = new Date(createCardDto.date.to);

      const newListEntity = await this.cardsService.createCard(cardEntity);
      await this.cardsMembersService.createCardMember(userId, newListEntity.id);

      return newListEntity;
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

  @Patch('/move-all')
  async moveAllCards(@Body() moveCardDto: any, @Param('listId') listId: number) {
    try {
      const listMoveToId = moveCardDto.listIdMoveTo;
      const listEntityFrom = new Lists();
      const listEntityTo = new Lists();

      listEntityFrom.id = listId;
      listEntityTo.id = listMoveToId;

      const cardsEntities = await this.cardsService.getCardsByList(listEntityFrom);

      cardsEntities.map((entity: Cards) => (entity.list = listEntityTo));

      return await this.cardsService.bulkUpdate(cardsEntities);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('/:cardId/')
  async updateCard(@Body() updateCardDto: any, @Param('cardId') cardId: number) {
    try {
      const cardEntity = await getManager().findOne(Cards, cardId);

      updateCardDto.name && (cardEntity.name = updateCardDto.name);
      updateCardDto.description && (cardEntity.description = updateCardDto.description);

      if(updateCardDto?.date?.from && updateCardDto?.date?.to) {
        cardEntity.date_interval_from = new Date(updateCardDto.date.from);
        cardEntity.date_interval_to = new Date(updateCardDto.date.to);
      }

      return await this.cardsService.updateCard(cardEntity);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('/:cardId/move')
  async moveCard(@Body() moveCardDto: any, @Param('cardId') cardId: number) {
    try {
      const listMoveToId = moveCardDto.listIdMoveTo;
      const listEntity = new Lists();
      const cardEntity = await getManager().findOne(Cards, cardId);

      listEntity.id = listMoveToId;
      cardEntity.list = listEntity;

      return await this.cardsService.updateCard(cardEntity);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/:cardId/attachment')
  @UseInterceptors(FileInterceptor('attachment'))
  async createAttachment(@UploadedFile() file: Express.Multer.File, @Param('cardId') cardId: number) {
    try {
      // next patch
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/:cardId/activity')
  async createActivity(@Body() createActivityDto: any, @Param('cardId') cardId: number) {
    try {
      const cardActivityEntity = new CardsActivities();
      const cardEntity = new Cards();

      cardEntity.id = cardId;
      cardActivityEntity.card = cardEntity;
      cardActivityEntity.message = createActivityDto.message;
      cardActivityEntity.date = new Date(createActivityDto.date);

      return await this.cardsActivityService.saveCardsActivity(cardActivityEntity);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}