import { HttpStatus, INestApplication } from '@nestjs/common';
import { Lists } from '../src/domains/lists/lists.model';

const request = require('supertest');

export class ListTesting {
  private app: INestApplication;
  private readonly workplaceId: number;
  private readonly projectId: number;

  constructor(app: INestApplication, workplaceId: number, projectId: number) {
    this.app = app;
    this.workplaceId = workplaceId;
    this.projectId = projectId;
  }

  private createPath() {
    return `/workplaces/${this.workplaceId}/projects/${this.projectId}`
  }

  async sendCreateListRequest(createListDto: any, expectStatus: HttpStatus, token: string) {
    const response = await request(this.app.getHttpServer())
      .post(`${this.createPath()}/lists/`)
      .set({ Authorization: `Bearer ${token}` })
      .send(createListDto)
      .expect(expectStatus);

    return response.body;
  }

  async sendGetListsRequest(expectStatus: HttpStatus, token: string) {
    const response = await request(this.app.getHttpServer())
      .get(`${this.createPath()}/lists/`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(expectStatus)
    return response.body;
  }

  async sendChangeListPositionRequest(
    changeListPositionDto: any,
    listId: number,
    expectStatus: HttpStatus,
    token: string
  ) {
    const response = await request(this.app.getHttpServer())
      .patch(`${this.createPath()}/lists/${listId}/change-list-position`)
      .set({ Authorization: `Bearer ${token}` })
      .send(changeListPositionDto)
      .expect(expectStatus);

    return response.body;
  }

  async changeListPositionCheck(
    lists: Lists[],
    token: string
  ) {
    const idListToMove = lists[0].id;
    let idx = lists.length;
    let selectedListsFromDb: Lists[] = [];

    for(let list of lists) {
      let changeListPositionDto = { newPosition: idx };
      await this.sendChangeListPositionRequest(
        changeListPositionDto,
        idListToMove,
        HttpStatus.OK,
        token
      );
      selectedListsFromDb = await this.sendGetListsRequest(HttpStatus.OK, token);
      console.log(selectedListsFromDb);
      if(!this.simpleCheckPositions(selectedListsFromDb)) {
        throw 'Checkout position error'
      }

      idx--;
    }
  }

  private simpleCheckPositions(lists: Lists[]) {
    let idx = 1;
    for(let list of lists) {
      if(lists.findIndex((list: any) => list.position === idx) === -1) {
        return false;
      }
      idx++;
    }
    return true;
  }

  async sendDeleteListRequest(listId: number, expectStatus: HttpStatus, token: string) {
    const response = await request(this.app.getHttpServer())
      .delete(`${this.createPath()}/lists/${listId}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(expectStatus);

    return response.body;
  }
}