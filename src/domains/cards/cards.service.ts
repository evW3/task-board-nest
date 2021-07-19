import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cards } from './cards.model';
import { Repository } from 'typeorm';
import { Lists } from '../lists/lists.model';

@Injectable()
export class CardsService {
  constructor(@InjectRepository(Cards) private readonly cardsRepository: Repository<Cards>) {}

  async createCard(card: Cards): Promise<Cards> {
    return await this.cardsRepository.save(card);
  }

  async getCardsByList(list: Lists): Promise<Cards[]> {
    return await this.cardsRepository.find({ where: { list } });
  }
}