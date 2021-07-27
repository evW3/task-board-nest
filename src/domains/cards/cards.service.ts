import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cards } from './cards.model';
import { Repository } from 'typeorm';
import { Lists } from '../lists/lists.model';
import { ProjectsMembersService } from '../projects/projectsMembers.service';

@Injectable()
export class CardsService {
  constructor(@InjectRepository(Cards) private readonly cardsRepository: Repository<Cards>) {}

  async createCard(card: Cards): Promise<Cards> {
    return await this.cardsRepository.save(card);
  }

  async getCardsByList(list: Lists): Promise<Cards[]> {
    return await this.cardsRepository.find({
      where: { list },
      order: { position: 'ASC' },
      join: {
        alias: 'cards',
        leftJoinAndSelect: {
          activity: 'cards.activities'
        }
      }
    });
  }

  async updateCard(card: Cards): Promise<Cards> {
    return await this.cardsRepository.save(card);
  }

  async bulkUpdate(cards: Cards[]): Promise<Cards[]> {
    return await this.cardsRepository.save(cards);
  }

  async deleteCard(card: Cards): Promise<void> {
    await this.cardsRepository.delete(card);
  }
}