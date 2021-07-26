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

const request = require('supertest')

describe('Project', () => {
  let app: INestApplication;
  const mockUser = mockUsers[4];
  const mockWorkplace = mockWorkplaces[3];
  const mockProject = mockProjects[2];
  const mockList = mockLists[2];
  const mockList1 = mockLists[3];
  const mockList2 = mockLists[4];

  const initTestingClasses = (app: INestApplication) => {
    authTesting = new AuthTesting(app);
    workplaceTesting = new WorkplaceTesting(app);
  }

  let appTesting: AppTesting;
  let authTesting: AuthTesting;
  let workplaceTesting: WorkplaceTesting;
  let projectTesting: ProjectTesting;

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

    done();
  });

  it('Should create lists', async (done) => {
    let response = await request(app.getHttpServer())
      .post(`/workplaces/${workplaceEntity.id}/projects/${projectEntity.id}/lists`)
      .set({ 'Authorization': `Bearer ${userToken}` })
      .send(mockList)
      .expect(HttpStatus.CREATED);
    listEntities.push(response.body);

    response = await request(app.getHttpServer())
      .post(`/workplaces/${workplaceEntity.id}/projects/${projectEntity.id}/lists`)
      .set({ 'Authorization': `Bearer ${userToken}` })
      .send(mockList1)
      .expect(HttpStatus.CREATED);
    listEntities.push(response.body);

    response = await request(app.getHttpServer())
      .post(`/workplaces/${workplaceEntity.id}/projects/${projectEntity.id}/lists`)
      .set({ 'Authorization': `Bearer ${userToken}` })
      .send(mockList2)
      .expect(HttpStatus.CREATED);
    listEntities.push(response.body);

    done();
  });

  it('Should change lists position', async (done) => {
    const idToChange = listEntities[0].id;
    await request(app.getHttpServer())
      .patch(`/workplaces/${workplaceEntity.id}/projects/${projectEntity.id}/lists/${idToChange}/change-list-position`)
      .set({ 'Authorization': `Bearer ${userToken}` })
      .send({ newPosition: 2 })
      .expect(HttpStatus.OK);

    let response = await request(app.getHttpServer())
      .get(`/workplaces/${workplaceEntity.id}/projects/${projectEntity.id}/lists/`)
      .set({ 'Authorization': `Bearer ${userToken}` })
      .expect(HttpStatus.OK);
    listEntities = response.body;

    if(!simpleCheckPositions(listEntities)) {
      done('change position error');
    }

    await request(app.getHttpServer())
      .patch(`/workplaces/${workplaceEntity.id}/projects/${projectEntity.id}/lists/${idToChange}/change-list-position`)
      .set({ 'Authorization': `Bearer ${userToken}` })
      .send({ newPosition: 1 })
      .expect(HttpStatus.OK);

    response = await request(app.getHttpServer())
      .get(`/workplaces/${workplaceEntity.id}/projects/${projectEntity.id}/lists/`)
      .set({ 'Authorization': `Bearer ${userToken}` })
      .expect(HttpStatus.OK);
    listEntities = response.body;

    if(!simpleCheckPositions(listEntities)) {
     done('change position error');
    }

    done();
  });

  it('Should delete list', async (done) => {
    await request(app.getHttpServer())
      .delete(`/workplaces/${workplaceEntity.id}/projects/${projectEntity.id}/lists/${listEntities[0].id}/`)
      .set({ 'Authorization': `Bearer ${userToken}` })
      .send(mockList)
      .expect(HttpStatus.OK);
    done();
  });

  afterAll(async (done) => {
    const connection = app.get(Connection);
    try {
      await connection
        .createQueryRunner()
        .query(`
          DELETE
          FROM users
          WHERE email='${mockUser.email}';
       `);
    } catch (e) {
      console.log(e);
    }
    done();
  });
})

function simpleCheckPositions(lists: Lists[]) {
  let idx = 1;
  for(let list of lists) {
    if(lists.findIndex((list: any) => list.position === idx) === -1) {
      return false;
    }
    idx++;
  }
  return true;
}