import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { mockUsers } from '../src/utils/mockConstants';
import { Connection } from 'typeorm';
const request = require('supertest')

describe('Auth', () => {
  let app: INestApplication;
  const mockUser = mockUsers[1];

  beforeAll(async (done) => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    done();
  })

  it('Should register user', async (done) => {
    await request(app.getHttpServer())
      .post(`/auth/sign-up`)
      .send(mockUser)
      .expect(HttpStatus.CREATED);
    done();
  });

  it('Shouldn`t register user', async (done) => {
    await request(app.getHttpServer())
      .post(`/auth/sign-up`)
      .send(mockUser)
      .expect(HttpStatus.BAD_REQUEST);
    done();
  });

  it('Should auth user', async (done) => {
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send({ password: mockUser.password, email: mockUser.email })
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