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
    appTesting = new AppTesting();
    await appTesting.startTestServer();

    authTesting = new AuthTesting(appTesting.app);

    done();
  });

  it('Should register user', async (done) => {
    await authTesting.sendRegisterRequest(mockUser, HttpStatus.CREATED);
    done();
  });

  it('Shouldn`t register user', async (done) => {
    await authTesting.sendRegisterRequest(mockUser, HttpStatus.BAD_REQUEST);
    done();
  });

  it('Should auth user', async (done) => {
    await authTesting.sendAuthRequest(mockAuthDto, HttpStatus.OK);
    done();
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
    } catch (e) {
      throw e;
    }
    done();
  });
})