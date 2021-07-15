import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Projects } from './projects.model';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Projects) private readonly projectsRepository: Repository<Projects>) {}

  async saveProject(project: Projects): Promise<Projects> {
    return await this.projectsRepository.save(project);
  }

  async deleteProject(project: Projects): Promise<void> {
    await this.projectsRepository.remove(project);
  }

  async updateProject(project: Projects): Promise<Projects> {
    return await this.projectsRepository.save(project);
  }

  async findProject(name: string): Promise<Projects> {
    return await this.projectsRepository.findOne({ where: { name } });
  }
}