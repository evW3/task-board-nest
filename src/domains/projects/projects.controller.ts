import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Projects } from './projects.model';
import { Workplaces } from '../workplaces/workplaces.model';
import { getManager } from 'typeorm';

@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('/')
  async createProject(@Body('name') name: string, @Param('workplaceId') workplaceId: number) {
    try {
      const projectEntity = new Projects();
      const workplaceEntity = new Workplaces();

      workplaceEntity.id = workplaceId;
      projectEntity.name = name;
      projectEntity.workplace = workplaceEntity;

      return await this.projectsService.saveProject(projectEntity);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/')
  async getProjects(@Param('workplaceId') workplaceId: number) {
    try {
      const workplaceEntity = new Workplaces();

      workplaceEntity.id = workplaceId;

      return await this.projectsService.getWorkplaceProjects(workplaceEntity);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('/:projectId')
  async updateProject(@Param('projectId') projectId: number, @Body('name') name: string) {
    try {
      const projectEntity = await getManager().findOne(Projects, projectId);

      projectEntity.name = name;

      return await this.projectsService.updateProject(projectEntity);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('/:projectId')
  async deleteProject(@Param('projectId') projectId: number) {
    try {
      const projectEntity = new Projects();

      projectEntity.id = projectId;

      await this.projectsService.deleteProject(projectEntity);

      return { message: 'Project was deleted!', status: HttpStatus.OK };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}