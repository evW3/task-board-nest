import { Routes } from 'nest-router';
import { WorkplacesModule } from '../domains/workplaces/workplaces.module';
import { ProjectsModule } from '../domains/projects/projects.module';

export const WorkplacesRoute: Routes = [
  {
    path: '/workplaces',
    module: WorkplacesModule,
    children: [
      { path: ':workplaceId/projects', module: ProjectsModule }
    ],
  },
];