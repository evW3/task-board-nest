import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Projects } from './projects.model';
import { Workplaces } from '../workplaces/workplaces.model';
import { getManager } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ProjectsMembersService } from './projectsMembers.service';
import { ProjectDto } from './dto/project.dto';

@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService,
              private readonly usersService: UsersService,
              private readonly projectsMembersService: ProjectsMembersService) {}

  @Post('/')
  async createProject(@Body() projectDto: ProjectDto, @Param('workplaceId') workplaceId: number) {
    try {
      const projectEntity = new Projects();
      const workplaceEntity = new Workplaces();

      workplaceEntity.id = workplaceId;
      projectEntity.name = projectDto.name;
      projectEntity.workplace = workplaceEntity;

      const newProjectEntity = await this.projectsService.saveProject(projectEntity);

      await this.projectsMembersService.saveProjectMember(newProjectEntity.id, projectDto.userId);

      return newProjectEntity;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/')
  async getProjects(@Param('workplaceId') workplaceId: number, @Body('userId') userId: number) {
    try {
      const workplaceEntity = new Workplaces();

      workplaceEntity.id = workplaceId;

      return await this.projectsService.getProjects(workplaceEntity);
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

  @Post('/:projectId/add-member')
  async addMemberToProject(@Body('userEmail') userEmail: string, @Param('projectId') projectId: number) {
    try {
      const userEntity = await this.usersService.findUserByEmail(userEmail);

      await this.projectsMembersService.saveProjectMember(projectId, userEntity.id);

      return { message: 'User was added to project', status: HttpStatus.OK };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}