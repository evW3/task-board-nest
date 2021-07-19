import { Injectable } from '@nestjs/common';
import { CardsActivities } from './cardsActivities.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CardsActivitiesService {
  constructor(@InjectRepository(CardsActivities) private readonly cardsActivityRepository: Repository<CardsActivities>) {}

  async saveCardsActivity(cardsActivity: CardsActivities): Promise<CardsActivities> {
    return await this.cardsActivityRepository.save(cardsActivity);
  }
}