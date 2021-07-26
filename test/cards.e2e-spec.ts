import { Test, TestingModule } from '@nestjs/testing';

const request = require('supertest')
import { Users } from '../src/domains/users/users.model';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Workplaces } from '../src/domains/workplaces/workplaces.model';
import { Connection } from 'typeorm';
import { Projects } from '../src/domains/projects/projects.model';
import { Lists } from '../src/domains/lists/lists.model';
import { Cards } from '../src/domains/cards/cards.model';
import {
  mockCard,
  mockLists,
  mockProjects,
  mockUsers,
  mockWorkplaces,
} from '../src/utils/mockConstants';

let app: INestApplication;

describe('Cards', () => {
  let userToken: string;
  const mockWorkplace = mockWorkplaces[0];
  const mockUser = mockUsers[0];
  const mockProject = mockProjects[0];
  let workplaceEntity: Workplaces;
  let userEntity: Users;
  let projectEntity: Projects;
  let listsEntities: Lists[] = [];
  let cardsEntities: Cards[] = [];

  beforeAll(async (done) => {
    try {
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

      const usersResponse = await request(app.getHttpServer())
        .get('/users')
        .set({ 'Authorization': `Bearer ${userToken}` });
      userEntity = usersResponse.body;

      const workplaceResponse = await request(app.getHttpServer())
        .post('/workplaces')
        .set({ 'Authorization': `Bearer ${userToken}` })
        .send(mockWorkplace)
        .expect(HttpStatus.CREATED)
      workplaceEntity = workplaceResponse.body;

      const projectResponse = await request(app.getHttpServer())
        .post(`/workplaces/${workplaceEntity.id}/projects`)
        .set({ 'Authorization': `Bearer ${userToken}` })
        .send(mockProject)
        .expect(HttpStatus.CREATED);
      projectEntity = projectResponse.body;

      let listResponse = await request(app.getHttpServer())
        .post(`/workplaces/${workplaceEntity.id}/projects/${projectEntity.id}/lists`)
        .set({ 'Authorization': `Bearer ${userToken}` })
        .send(mockLists[0])
        .expect(HttpStatus.CREATED)
      listsEntities.push(listResponse.body);

      listResponse = await request(app.getHttpServer())
        .post(`/workplaces/${workplaceEntity.id}/projects/${projectEntity.id}/lists`)
        .set({ 'Authorization': `Bearer ${userToken}` })
        .send(mockLists[1])
        .expect(HttpStatus.CREATED)
      listsEntities.push(listResponse.body);

      let cardsResponse = await request(app.getHttpServer())
        .post(`/workplaces/${workplaceEntity.id}/projects/${projectEntity.id}/lists/${listsEntities[0].id}/cards`)
        .set({ 'Authorization': `Bearer ${userToken}` })
        .send(mockCard)
        .expect(HttpStatus.CREATED);
      cardsEntities.push(cardsResponse.body);

      cardsResponse = await request(app.getHttpServer())
        .post(`/workplaces/${workplaceEntity.id}/projects/${projectEntity.id}/lists/${listsEntities[0].id}/cards`)
        .set({ 'Authorization': `Bearer ${userToken}` })
        .send(mockCard)
        .expect(HttpStatus.CREATED);
      cardsEntities.push(cardsResponse.body);

      cardsResponse = await request(app.getHttpServer())
        .post(`/workplaces/${workplaceEntity.id}/projects/${projectEntity.id}/lists/${listsEntities[0].id}/cards`)
        .set({ 'Authorization': `Bearer ${userToken}` })
        .send(mockCard)
        .expect(HttpStatus.CREATED);
      cardsEntities.push(cardsResponse.body);

      done();
    } catch (e) {
      console.log(e);
    }
  });

  it('test', async (done) => {
    // const connection = app.get(Connection);
    //
    // console.log(await connection.getRepository(Lists).find());
    done();
  });

  afterAll(async (done) => {
    const connection = app.get(Connection);

    // await connection
    //   .getRepository(Cards)
    //   .remove(cardsEntities);
    //
    // await connection
    //   .getRepository(Lists)
    //   .remove(listsEntities);
    //
    // await connection
    //   .getRepository(Projects)
    //   .remove(projectEntity);
    //
    // await connection
    //   .getRepository(Workplaces)
    //   .remove(workplaceEntity);

    await connection
      .getRepository(Users)
      .remove(userEntity);

    done();
  });
});