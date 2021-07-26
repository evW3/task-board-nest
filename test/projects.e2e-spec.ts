import { HttpStatus, INestApplication } from '@nestjs/common';
import { mockProjects, mockUsers, mockWorkplaces } from '../src/utils/mockConstants';
import { Workplaces } from '../src/domains/workplaces/workplaces.model';
import { Projects } from '../src/domains/projects/projects.model';
import { AppTesting } from './AppTesting';
import { AuthTesting } from './AuthTesting';
import { WorkplaceTesting } from './WorkplaceTesting';
import { ProjectTesting } from './ProjectTesting';

describe('Project', () => {
  const mockUser = mockUsers[3];
  const mockWorkplace = mockWorkplaces[2];
  const mockProject = mockProjects[1];
  const mockUpdateProject = { name: 'Some new, awesome project name' };

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

    done();
  });

  it('Should create project', async (done) => {
    projectEntity = await projectTesting
      .sendCreateProjectRequest(mockProject, HttpStatus.CREATED, userToken);
    done();
  });

  it('Should update project', async (done)  => {
    projectEntity = await projectTesting
      .sendUpdateProjectRequest(mockUpdateProject, projectEntity.id, HttpStatus.OK, userToken)
    done();
  });

  it('Should delete project', async (done) => {
    await projectTesting.sendDeleteProjectRequest(projectEntity.id, HttpStatus.OK, userToken);
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