import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { mockLists, mockProjects, mockUsers, mockWorkplaces } from '../src/utils/mockConstants';
import { Connection } from 'typeorm';
import { Workplaces } from '../src/domains/workplaces/workplaces.model';
import { Projects } from '../src/domains/projects/projects.model';
import { Lists } from '../src/domains/lists/lists.model';
const request = require('supertest')

describe('Project', () => {
  let app: INestApplication;
  const mockUser = mockUsers[4];
  const mockWorkplace = mockWorkplaces[3];
  const mockProject = mockProjects[2];
  const mockList = mockLists[2];
  const mockList1 = mockLists[3];
  const mockList2 = mockLists[4];
  let workplaceEntity: Workplaces;
  let projectEntity: Projects;
  let listEntities: Lists[] = [];
  let userToken: string;

  beforeAll(async (done) => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const authResponse = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(mockUser)
      .expect(HttpStatus.CREATED)
    userToken = authResponse.body.token;

    const workplaceResponse = await request(app.getHttpServer())
      .post('/workplaces')
      .set({ 'Authorization': `Bearer ${userToken}` })
      .send(mockWorkplace)
      .expect(HttpStatus.CREATED);
    workplaceEntity = workplaceResponse.body;

    const projectResponse = await request(app.getHttpServer())
      .post(`/workplaces/${workplaceEntity.id}/projects`)
      .set({ 'Authorization': `Bearer ${userToken}` })
      .send(mockProject)
      .expect(HttpStatus.CREATED);
    projectEntity = projectResponse.body;

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
      done('Error');
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
      done('Error');
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
  for(let list of lists) {
    let idx = 1;
    if(lists.findIndex((list: any) => list.position === idx) === -1) {
      return false;
    }
    idx++;
  }
  console.log('\n');
  return true;
}