import { Injectable } from '@nestjs/common';
import { Lists } from './lists.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projects } from '../projects/projects.model';

@Injectable()
export class ListsService {
  constructor(@InjectRepository(Lists) private readonly listsRepository: Repository<Lists>) {}

  async saveList(list: Lists): Promise<Lists> {
    return await this.listsRepository.save(list);
  }

  async updateList(list: Lists): Promise<Lists> {
    return await this.listsRepository.save(list);
  }

  async getLists(project: Projects): Promise<Lists[]> {
    return await this.listsRepository.find({
      where: { project },
      order: { position: 'ASC' },
      join: {
        alias: 'list',
        leftJoinAndSelect: {
          cards: 'list.cards'
        }
      }
    });
  }

  async deleteList(list: Lists): Promise<void> {
    await this.listsRepository.remove(list);
  }

  async isListExists(list: Lists): Promise<boolean> {
    return await this.listsRepository.count(list) === 1;
  }

  async getList(list: Lists): Promise<Lists> {
    return await this.listsRepository.findOne(list);
  }

  async bulkSaveLists(lists: Lists[]): Promise<any> {
    return await this.listsRepository.save(lists);
  }
}