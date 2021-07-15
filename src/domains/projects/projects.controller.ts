import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Projects } from './projects.model';

@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('/')
  async createProject(@Body('name') name: string) {
    try {
      const projectEntity = new Projects();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}