import { HttpStatus, INestApplication } from '@nestjs/common';
import { Lists } from '../src/domains/lists/lists.model';
import { Cards } from '../src/domains/cards/cards.model';

const request = require('supertest');

export class CardTesting {
  private app: INestApplication;
  private readonly workplaceId: number;
  private readonly projectId: number;

  constructor(app: INestApplication, workplaceId: number, projectId: number) {
    this.app = app;
    this.workplaceId = workplaceId;
    this.projectId = projectId;
  }

  private createPath() {
    return `/workplaces/${this.workplaceId}/projects/${this.projectId}`;
  }

  async sendCreateCardRequest(
    createCardDto: any,
    listId: number,
    expectStatus: HttpStatus,
    token: string
  ) {
    const response = await request(this.app.getHttpServer())
      .post(`${this.createPath()}/lists/${listId}/cards/`)
      .set({ Authorization: `Bearer ${token}` })
      .send(createCardDto)
      .expect(expectStatus);

    return response.body;
  }

  async sendUpdateCardRequest(
    updateCardDto: any,
    cardId: number,
    listId: number,
    expectStatus: HttpStatus,
    token: string
  ) {
    const response = await request(this.app.getHttpServer())
      .patch(`${this.createPath()}/lists/${listId}/cards/${cardId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send(updateCardDto)
      .expect(expectStatus);

    return response.body;
  }

  async sendGetCardsRequest(
    listId: number,
    expectStatus: HttpStatus,
    token: string
  ) {
    const response = await request(this.app.getHttpServer())
      .get(`${this.createPath()}/lists/${listId}/cards/`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(expectStatus);
    return response.body;
  }

  async changeCardPositionCheck(
    changeCardPositionDto: any,
    cardIdToMove: number,
    listIdFrom: number,
    expectStatus: HttpStatus,
    token: string
  ) {
    const response = await request(this.app.getHttpServer())
      .patch(`${this.createPath()}/lists/${listIdFrom}/cards/${cardIdToMove}/change-card-position`)
      .set({ Authorization: `Bearer ${token}` })
      .send(changeCardPositionDto)
      //.expect(expectStatus);
    console.log(response.body);
    return response.body;
  }

  async sendDeleteCardRequest(
    listId: number,
    cardId: number,
    expectStatus: HttpStatus,
    token: string,
    ) {
    const response = await request(this.app.getHttpServer())
      .delete(`${this.createPath()}/lists/${listId}/cards/${cardId}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(expectStatus);
    return response.body;
  }

}