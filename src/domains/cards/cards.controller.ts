import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param, Patch,
  Post, Req, UploadedFile,
  UseInterceptors, UsePipes,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { Cards } from './cards.model';
import { Lists } from '../lists/lists.model';
import { CardsMembersService } from './cardsMembers.service';
import { getManager } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CardsActivities } from './cardsActivities.model';
import { CardsActivitiesService } from './cardsActivities.service';
import { CreateCardDto } from './dto/createCard.dto';
import { UpdateCardDto } from './dto/updateCard.dto';
import { CreateActivityDto } from './dto/createActivity.dto';
import { SchemaValidatePipe } from '../../pipes/schemaValidate.pipe';
import { CreateActivitySchema } from './schemas/createActivity.schema';
import { CreateCardSchema } from './schemas/createCard.schema';
import { PositionQueriesService } from '../lists/positionQueries.service';

@Controller()
export class CardsController {
  constructor(private readonly cardsService: CardsService,
              private readonly cardsMembersService: CardsMembersService,
              private readonly cardsActivityService: CardsActivitiesService,
              private readonly positionQueriesService: PositionQueriesService) {}

  @Post('/')
  //@UsePipes(new SchemaValidatePipe(CreateCardSchema))
  async createCard(@Body() createCardDto: CreateCardDto, @Param('listId') listId: number) {
    try {
      const cardEntity = new Cards();
      const listEntity = new Lists();
      const userId = createCardDto.userId;
      const lastPosition = (await this.positionQueriesService.getMaxOrMinPosition('lists', listId, 'cards', 'MAX'))[0].position || 0;

      listEntity.id = listId;
      cardEntity.name = createCardDto.name;
      createCardDto.description && (cardEntity.description = createCardDto.description);
      cardEntity.list = listEntity;
      cardEntity.position = lastPosition + 1;
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
  async moveAllCards(@Body('listIdMoveTo') listIdMoveTo: number, @Param('listId') listId: number) {
    try {            
      const listEntityFrom = new Lists();
      const listEntityTo = new Lists();
      let lastPosition = (await this.positionQueriesService.getMaxOrMinPosition('lists', listIdMoveTo, 'cards', 'MAX'))[0].position || 0;
      
      listEntityFrom.id = listId;
      listEntityTo.id = listIdMoveTo;

      const cardsEntities = await this.cardsService.getCardsByList(listEntityFrom);

      cardsEntities.map((entity: Cards) => ((entity.list = listEntityTo) && (entity.position = ++lastPosition)));

      return await this.cardsService.bulkUpdate(cardsEntities);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('/:cardId/')
  async updateCard(@Body() updateCardDto: UpdateCardDto, @Param('cardId') cardId: number) {
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

  @Patch('/:cardId/change-card-position')
  async moveCard(@Body() changePositionDto: any, @Param('cardId') cardId: number, @Req() req: Request) {
    try {
      const listEntity = new Lists();
      const listId = Number.parseInt(req.params.listId);
      const cardEntity = await getManager().findOne(Cards, cardId);
      const isPositionPlaceEmpty = await this.positionQueriesService.getEntityByPosition('lists', 'cards', changePositionDto.listIdMoveTo, cardEntity.position);

      // console.log(isPositionPlaceEmpty);
      // console.log(listId, ' listId');
      // console.log(changePositionDto.listIdMoveTo, ' changePositionDto.listIdMoveTo');
      // console.log((listId === changePositionDto.listIdMoveTo) && (isPositionPlaceEmpty.length != 0));

      if(listId != changePositionDto.listIdMoveTo) {
        console.log('1');
        // console.log(cardEntity);
        await this.positionQueriesService.decreaseOrIncreaseInPositions('lists', 'cards', listId, cardEntity.position, true);
        //console.log(await this.positionQueriesService.test());
        if(isPositionPlaceEmpty.length != 0) {
          console.log('2');
          await this.positionQueriesService.decreaseOrIncreaseInPositions('lists', 'cards', changePositionDto.listIdMoveTo, changePositionDto.newPosition, false)
          // console.log(await this.positionQueriesService.test());
        }
      } else if((listId === changePositionDto.listIdMoveTo) && (isPositionPlaceEmpty.length != 0)) {
        console.log('3');
        await this.positionQueriesService.changePositionWithJoin('lists', changePositionDto.listIdMoveTo, 'cards', changePositionDto.newPosition, cardEntity.position);
      }

      listEntity.id = changePositionDto.listIdMoveTo;
      cardEntity.list = listEntity;
      cardEntity.position = changePositionDto.newPosition;

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
  @UsePipes(new SchemaValidatePipe(CreateActivitySchema))
  async createActivity(@Body() createActivityDto: CreateActivityDto, @Req() req: Request) {
    try {
      const cardActivityEntity = new CardsActivities();
      const cardEntity = new Cards();

      cardEntity.id = Number.parseInt(req.params.cardId);
      cardActivityEntity.card = cardEntity;
      cardActivityEntity.message = createActivityDto.message;
      cardActivityEntity.date = new Date(createActivityDto.date);

      return await this.cardsActivityService.saveCardsActivity(cardActivityEntity);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('/:cardId/')
  async deleteCard(@Param('cardId') cardId: number) {
    try {
        const cardEntity = await getManager().findOne(Cards, cardId);

        await this.cardsService.deleteCard(cardEntity);
        return { message: 'Card was deleted', status: HttpStatus.OK }
    } catch(e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}