import { HttpStatus, INestApplication } from '@nestjs/common';
import { mockUsers, mockWorkplaces } from '../src/utils/mockConstants';
import { Workplaces } from '../src/domains/workplaces/workplaces.model';
import { AuthTesting } from './AuthTesting';
import { WorkplaceTesting } from './WorkplaceTesting';
import { AppTesting } from './AppTesting';

describe('Workplace', () => {
  const mockUser = mockUsers[2];
  const mockWorkplace = mockWorkplaces[1];
  const mockUpdateWorkplace = { name: 'Some new, awesome name' };

  const initTestingClasses = (app: INestApplication) => {
    authTesting = new AuthTesting(app);
    workplaceTesting = new WorkplaceTesting(app);
  }

  let appTesting: AppTesting;
  let workplaceTesting: WorkplaceTesting;
  let authTesting: AuthTesting;

  let userToken: string;
  let workplaceEntity: Workplaces;

  beforeAll(async (done) => {
    appTesting = new AppTesting();
    await appTesting.startTestServer();

    initTestingClasses(appTesting.app);

    userToken = await authTesting.sendRegisterRequest(mockUser, HttpStatus.CREATED);

    done();
  });

  it('Should create workplace', async (done) => {
    workplaceEntity = await workplaceTesting
      .sendCreateWorkplaceRequest(mockWorkplace, HttpStatus.CREATED, userToken);
    done();
  });

  it('Should update workplace', async (done)  => {
    workplaceEntity = await workplaceTesting
      .sendUpdateWorkplaceRequest(mockUpdateWorkplace, workplaceEntity.id, HttpStatus.OK, userToken);
    done();
  });

  it('Should delete workplace', async (done) => {
    await workplaceTesting
      .sendDeleteWorkplaceRequest(workplaceEntity.id, HttpStatus.OK, userToken);
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
});