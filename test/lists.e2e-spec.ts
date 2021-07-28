import { HttpStatus, INestApplication } from '@nestjs/common';
import { mockLists, mockProjects, mockUsers, mockWorkplaces } from '../src/utils/mockConstants';
import { Workplaces } from '../src/domains/workplaces/workplaces.model';
import { Projects } from '../src/domains/projects/projects.model';
import { Lists } from '../src/domains/lists/lists.model';
import { AppTesting } from './AppTesting';
import { AuthTesting } from './AuthTesting';
import { WorkplaceTesting } from './WorkplaceTesting';
import { ProjectTesting } from './ProjectTesting';
import { ListTesting } from './ListTesting';

describe('Project', () => {
  const mockUser = mockUsers[4];
  const mockWorkplace = mockWorkplaces[3];
  const mockProject = mockProjects[2];
  const innerMockLists = [mockLists[2], mockLists[3], mockLists[4]];

  const initTestingClasses = (app: INestApplication) => {
    authTesting = new AuthTesting(app);
    workplaceTesting = new WorkplaceTesting(app);
  }

  let appTesting: AppTesting;
  let authTesting: AuthTesting;
  let workplaceTesting: WorkplaceTesting;
  let projectTesting: ProjectTesting;
  let listTesting: ListTesting;

  let workplaceEntity: Workplaces;
  let projectEntity: Projects;
  let listEntities: Lists[] = [];
  let userToken: string;

  beforeAll(async (done) => { 
    try {
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
  
      listTesting = new ListTesting(appTesting.app, workplaceEntity.id, projectEntity.id);
  
      done();
    } catch(e) {
      throw e;
    }
  });

  it('Should create lists', async (done) => {
    try {
      for(let mockList of innerMockLists) {
        const res = await listTesting
          .sendCreateListRequest(mockList, HttpStatus.CREATED, userToken);
  
        listEntities.push(res);
      }
      done();
    } catch(e) {
      throw e;
    }
  });

  it('Should change list position', async (done) => {
    try {
      await listTesting
        .changeListPositionCheck(listEntities, userToken);
      done();
    } catch (e) {
      throw e;
    }
  });

  it('Should delete list', async (done) => {
    try {
      await listTesting
        .sendDeleteListRequest(listEntities[0].id, HttpStatus.OK, userToken);
      done();
    } catch(e) {
      throw e;
    }
  });

  it('Should get lists', async (done) => {
    try {
      await listTesting.sendGetListsRequest(HttpStatus.OK, userToken);
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

