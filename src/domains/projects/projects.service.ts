import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Projects } from './projects.model';
import { Repository } from 'typeorm';
import { Workplaces } from '../workplaces/workplaces.model';
import { Users } from '../users/users.model';

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

  async isExistsProjects(project: Projects): Promise<boolean> {
    return await this.projectsRepository.count(project) === 1;
  }

  async getProjectMembers(project: Projects): Promise<Projects> {
    return await this.projectsRepository.findOne(
      {
        where: {
          id: project.id,
        },
        join: {
          alias: 'project',
          leftJoinAndSelect: {
            users: 'project.users'
          }
        }
      });
  }
}