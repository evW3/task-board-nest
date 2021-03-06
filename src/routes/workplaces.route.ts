import { Routes } from 'nest-router';
import { WorkplacesModule } from '../domains/workplaces/workplaces.module';
import { ProjectsModule } from '../domains/projects/projects.module';
import { ListsModule } from '../domains/lists/lists.module';
import { CardsModule } from '../domains/cards/cards.module';

export const WorkplacesRoute: Routes = [
  {
    path: '/workplaces',
    module: WorkplacesModule,
    children: [
      {
        path: ':workplaceId/projects',
        module: ProjectsModule,
        children: [
          {
            path: ':projectId/lists',
            module: ListsModule,
            children: [
              {
                path: ':listId/cards',
                module: CardsModule
              }
            ]
          }
        ]
      }
    ],
  },
];