import { HttpStatus, INestApplication } from '@nestjs/common';
import { mockLists, mockProjects, mockUsers, mockWorkplaces } from '../src/utils/mockConstants';
import { Connection } from 'typeorm';
import { Workplaces } from '../src/domains/workplaces/workplaces.model';
import { Projects } from '../src/domains/projects/projects.model';
import { Lists } from '../src/domains/lists/lists.model';
import { AppTesting } from './AppTesting';
import { AuthTesting } from './AuthTesting';
import { WorkplaceTesting } from './WorkplaceTesting';
import { ProjectTesting } from './ProjectTesting';
import { ListTesting } from './ListTesting';

const request = require('supertest')

describe('Project', () => {
  const mockUser = mockUsers[4];
  const mockWorkplace = mockWorkplaces[3];
  const mockProject = mockProjects[2];
  const innerMockLists = [mockLists[2], mockLists[3], mockLists[4]];

  const initTestingClasses = (app: INestApplication) => {
    authTesting = new AuthTesting(app);
    workplaceTesting = new WorkplaceTesting(app);
  }

  let appTesting: AppTesting;
  let authTesting: AuthTesting;
  let workplaceTesting: WorkplaceTesting;
  let projectTesting: ProjectTesting;
  let listTesting: ListTesting;

  let workplaceEntity: Workplaces;
  let projectEntity: Projects;
  let listEntities: Lists[] = [];
  let userToken: string;

  beforeAll(async (done) => {
    appTesting = new AppTesting();
    await appTesting.startTestServer();

    initTestingClasses(appTesting.app);

    userToken = await authTesting
      .sendRegisterRequest(mockUser, HttpStatus.CREATED);

    workplaceEntity = await workplaceTesting
      .sendCreateWorkplaceRequest(mockWorkplace, HttpStatus.CREATED, userToken);

    projectTesting = new ProjectTesting(appTesting.app, workplaceEntity.id);

    projectEntity = await projectTesting
      .sendCreateProjectRequest(mockProject, HttpStatus.CREATED, userToken);

    listTesting = new ListTesting(appTesting.app, workplaceEntity.id, projectEntity.id);

    done();
  });

  it('Should create lists', async (done) => {
    for(let mockList of innerMockLists) {
      const res = await listTesting
        .sendCreateListRequest(mockList, HttpStatus.CREATED, userToken);

      listEntities.push(res);
    }
    done();
  });

  it('Should change lists position', async (done) => {
    try {
      await listTesting.changeListPositionCheck(listEntities, userToken);
    } catch (e) {
      throw e;
    }
    done();
  });

  // it('Should delete list', async (done) => {
  //   await request(app.getHttpServer())
  //     .delete(`/workplaces/${workplaceEntity.id}/projects/${projectEntity.id}/lists/${listEntities[0].id}/`)
  //     .set({ 'Authorization': `Bearer ${userToken}` })
  //     .send(mockList)
  //     .expect(HttpStatus.OK);
  //   done();
  // });

  afterAll(async (done) => {
    try {
      const connection = appTesting.getConnection();

      await connection
        .createQueryRunner()
        .query(`
          DELETE
          FROM users
          WHERE email='${mockUser.email}';
       `);
    } catch (e) {
      throw e;
    }
    done();
  });
})

