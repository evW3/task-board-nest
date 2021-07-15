import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workplaces } from './workplaces.model';
import { Repository } from 'typeorm';
import { Users } from '../users/users.model';

@Injectable()
export class WorkplacesService {
  constructor(@InjectRepository(Workplaces) private readonly workplaceRepository: Repository<Workplaces>) {}

  async saveWorkplace(workplace: Workplaces): Promise<Workplaces> {
    return await this.workplaceRepository.save(workplace);
  }

  async isExistsWorkplace(workplace: Workplaces): Promise<boolean> {
    return await this.workplaceRepository.count(workplace) >= 1;
  }

  async getUsersWorkplaces(user: Users): Promise<Workplaces[]> {
    return await this.workplaceRepository.find({ where: { user } });
  }

  async deleteWorkplace(workplace: Workplaces) {
    await this.workplaceRepository.remove(workplace);
  }

  async updateWorkplace(workplace: Workplaces): Promise<Workplaces> {
    return await this.workplaceRepository.save(workplace);
  }

}