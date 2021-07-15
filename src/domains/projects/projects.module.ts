import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from './projects.model';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Projects])
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService]
})
export class ProjectsModule {}