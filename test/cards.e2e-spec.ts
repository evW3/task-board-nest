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
import { MyLogger } from '../src/utils/myLogger';

const request = require('supertest')

let app: INestApplication;

describe('Cards', () => {
  const mockWorkplace = mockWorkplaces[0];
  const mockUser = mockUsers[0];
  const mockProject = mockProjects[0];
  const innerMockLists = [mockLists[0], mockLists[1]];
  const mockCards = [mockCard, mockCard, mockCard, mockCard, mockCard, mockCard];
  const mockUpdateCard = { name: 'OHH DAMN', description: 'VERY LARGE TROUBLES' };
  const logger = new MyLogger();

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
  }, 10000);

  it('Should create cards', async (done) => {
    try {
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
      done();
    } catch(e) {
      throw e;
    }
  });

  it('Should update card', async (done) => {
    try {
      cardsEntities[0] = await cardTesting.sendUpdateCardRequest(
        mockUpdateCard,
        cardsEntities[0].id,
        listsEntities[0].id,
        HttpStatus.OK,
        userToken
      );
      done();
    } catch(e) {
      throw e;
    }
  });

  it('Should change card position', async (done) => {
    try {
      const interval = setInterval(async () => {
        const lists = await listTesting.sendGetListsRequest(HttpStatus.OK, userToken);
        
        let randomListFromIdx = findListWithCards(lists);
  
        const randomCardToMoveIdx = getRandomInt(lists[randomListFromIdx].cards.length);
        const randomListToIdx = getRandomInt(lists.length);
  
        let randomCardPositionToMove = -1;
        let randomMockChangePositionDto = {};
  
        if(randomListFromIdx === randomListToIdx) {
          let innerCardsArray = [...lists[randomListFromIdx].cards];
          
          randomCardPositionToMove = innerCardsArray[getRandomInt(innerCardsArray.length)].position;
        } else {
          let innerCardsArray = lists[randomListToIdx].cards;
  
          if(innerCardsArray.length === 0) {
            randomCardPositionToMove = 1;
          } else {
            let maxPosition = 0;
            innerCardsArray.forEach((card: Cards) => (maxPosition < card.position) && (maxPosition = card.position));
            randomCardPositionToMove = getRandomInt(maxPosition) + 1;
          }
        }
        
        randomMockChangePositionDto = {
          listIdMoveTo: lists[randomListToIdx].id,
          newPosition: randomCardPositionToMove
        }
        
        cardTesting.changeCardPositionCheck(
          randomMockChangePositionDto,
          lists[randomListFromIdx].cards[randomCardToMoveIdx].id,
          lists[randomListFromIdx].id,
          HttpStatus.OK,
          userToken
        );
      }, 100);
      
      const timeout = setTimeout(() => {
        clearInterval(interval);
        clearTimeout(timeout);
        done();
      }, 1000);
    } catch(e) {
      throw e;
    }
  });

  it('Should delete card', async (done) => {
    try {
      await cardTesting.sendDeleteCardRequest(
        listsEntities[0].id,
        cardsEntities[0].id,
        HttpStatus.OK,
        userToken
      );
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

  function getRandomInt(max: number) {
    return ~~(Math.random() * max)
  }

  function findListWithCards(lists: Lists[]) {
    let errorChecker = 0;
    let randomListFromIdx = getRandomInt(lists.length);

    while(lists[randomListFromIdx].cards.length === 0) {
      if(errorChecker >= 100) {
        break;
      }
      errorChecker++;
      randomListFromIdx = getRandomInt(lists.length);
    }

    if(errorChecker >= 100) {
      throw 'While exepection';
    }
    return randomListFromIdx;
  }
});