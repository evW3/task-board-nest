import { HttpStatus, INestApplication } from '@nestjs/common';
import { Workplaces } from '../src/domains/workplaces/workplaces.model';
import { Projects } from '../src/domains/projects/projects.model';
import { Lists } from '../src/domains/lists/lists.model';
import { Cards } from '../src/domains/cards/cards.model';
import { mockCard, mockLists, mockProjects, mockUsers, mockWorkplaces } from '../src/utils/mockConstants';
import { AppTesting } from './AppTesting';
import { AuthTesting } from './AuthTesting';
import { WorkplaceTesting } from './WorkplaceTesting';
import { ProjectTesting } from './ProjectTesting';
import { ListTesting } from './ListTesting';
import { CardTesting } from './CardTesting';

const request = require('supertest')

let app: INestApplication;

describe('Cards', () => {
  const mockWorkplace = mockWorkplaces[0];
  const mockUser = mockUsers[0];
  const mockProject = mockProjects[0];
  const innerMockLists = [mockLists[0], mockLists[1]];
  const mockCards = [mockCard, mockCard, mockCard, mockCard, mockCard, mockCard]

  const initTestingClasses = (app: INestApplication) => {
    authTesting = new AuthTesting(app);
    workplaceTesting = new WorkplaceTesting(app);
  }

  let appTesting: AppTesting;
  let authTesting: AuthTesting;
  let workplaceTesting: WorkplaceTesting;
  let projectTesting: ProjectTesting;
  let listTesting: ListTesting;
  let cardTesting: CardTesting;

  let userToken: string;
  let workplaceEntity: Workplaces;
  let projectEntity: Projects;
  let listsEntities: Lists[] = [];
  let cardsEntities: Cards[] = [];

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
      cardTesting = new CardTesting(appTesting.app, workplaceEntity.id, projectEntity.id);

      listsEntities = await listTesting
        .bulkCreateLists(innerMockLists, HttpStatus.CREATED, userToken);

      done();
    } catch (e) {
      throw e;
    }
  });

  it('Should create cards', async (done) => {
    let counter = 1;
    let listIdx = 0;

    for(let mockCard of mockCards) {

      if(counter === ((~~(mockCards.length / listsEntities.length)) + 1)) {
        listIdx++;
      }

      cardsEntities.push(
        await cardTesting
          .sendCreateCardRequest(mockCard, listsEntities[listIdx].id, HttpStatus.CREATED, userToken)
      );

      counter++;
    }
    console.log(cardsEntities);
    done();
  });

  it('Should update card', async (done) => {

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