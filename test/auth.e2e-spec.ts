import { HttpStatus } from '@nestjs/common';
import { mockUsers } from '../src/utils/mockConstants';
import { AuthTesting } from './AuthTesting';
import { AppTesting } from './AppTesting';

describe('Auth', () => {
  const mockUser = mockUsers[1];
  const mockAuthDto = { password: mockUser.password, email: mockUser.email };

  let appTesting: AppTesting;
  let authTesting: AuthTesting;

  beforeAll(async (done) => {
    try {
      appTesting = new AppTesting();
      await appTesting.startTestServer();
  
      authTesting = new AuthTesting(appTesting.app);
  
      done();
    } catch(e) {
      throw e;
    }
  });

  it('Should register user', async (done) => {
    try {
      await authTesting.sendRegisterRequest(mockUser, HttpStatus.CREATED);
      done();
    } catch(e) {
      throw e;
    }
  });

  it('Shouldn`t register user', async (done) => {
    try {
      await authTesting.sendRegisterRequest(mockUser, HttpStatus.BAD_REQUEST);
      done(); 
    } catch(e) {
      throw e;
    }
  });

  it('Should auth user', async (done) => {
    try {
      await authTesting.sendAuthRequest(mockAuthDto, HttpStatus.OK);
      done();
    } catch(e) {
      throw e;
    }
  });

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
      done();
    } catch (e) {
      throw e;
    }
  });
})