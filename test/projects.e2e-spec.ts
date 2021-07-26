import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { mockProjects, mockUsers, mockWorkplaces } from '../src/utils/mockConstants';
import { Connection } from 'typeorm';
import { Workplaces } from '../src/domains/workplaces/workplaces.model';
import { Projects } from '../src/domains/projects/projects.model';
const request = require('supertest')

describe('Project', () => {
  let app: INestApplication;
  const mockUser = mockUsers[3];
  const mockWorkplace = mockWorkplaces[2];
  const mockProject = mockProjects[1]
  let workplaceEntity: Workplaces;
  let projectEntity: Projects;
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

    done();
  });

  it('Should create project', async (done) => {
    const response = await request(app.getHttpServer())
      .post(`/workplaces/${workplaceEntity.id}/projects`)
      .set({ 'Authorization': `Bearer ${userToken}` })
      .send(mockProject)
      .expect(HttpStatus.CREATED);

    projectEntity = response.body;
    done();
  });

  it('Should update project', async (done)  => {
    const response = await request(app.getHttpServer())
      .patch(`/workplaces/${workplaceEntity.id}/projects/${projectEntity.id}`)
      .set({ 'Authorization': `Bearer ${userToken}` })
      .send({ name: 'Some new, awesome project name' })
      .expect(HttpStatus.OK);

    projectEntity = response.body;
    done();
  });

  it('Should delete project', async (done) => {
    await request(app.getHttpServer())
      .delete(`/workplaces/${workplaceEntity.id}/projects/${projectEntity.id}`)
      .set({ 'Authorization': `Bearer ${userToken}` })
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