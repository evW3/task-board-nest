import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { mockUsers, mockWorkplaces } from '../src/utils/mockConstants';
import { Connection } from 'typeorm';
import { Workplaces } from '../src/domains/workplaces/workplaces.model';
const request = require('supertest')

describe('Workplace', () => {
  let app: INestApplication;
  const mockUser = mockUsers[2];
  const mockWorkplace = mockWorkplaces[1];
  let workplaceEntity: Workplaces;
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

    done();
  });

  it('Should create workplace', async (done) => {
    const response = await request(app.getHttpServer())
      .post('/workplaces')
      .set({ 'Authorization': `Bearer ${userToken}` })
      .send(mockWorkplace)
      .expect(HttpStatus.CREATED);

    workplaceEntity = response.body;
    done();
  });

  it('Should update workplace', async (done)  => {
    const response = await request(app.getHttpServer())
      .patch(`/workplaces/${workplaceEntity.id}`)
      .set({ 'Authorization': `Bearer ${userToken}` })
      .send({ name: 'Some new, awesome name' })
      .expect(HttpStatus.OK);

    workplaceEntity = response.body;
    done();
  });

  it('Should delete workplace', async (done) => {
    await request(app.getHttpServer())
      .delete(`/workplaces/${workplaceEntity.id}`)
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