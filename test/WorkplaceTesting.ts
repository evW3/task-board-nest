import { HttpStatus, INestApplication } from '@nestjs/common';
const request = require('supertest');

export class WorkplaceTesting {
  private app: INestApplication;
  constructor(app: INestApplication) {
    this.app = app;
  }

  async sendCreateWorkplaceRequest(createWorkplaceDto: any, expectStatus: HttpStatus, token: string) {
    const response = await request(this.app.getHttpServer())
      .post(`/workplaces`)
      .set({ Authorization: `Bearer ${token}` })
      .send(createWorkplaceDto)
      .expect(expectStatus);

    return response.body;
  }

  async sendUpdateWorkplaceRequest(
    updateWorkplaceDto: any,
    workplaceId: number,
    expectStatus: HttpStatus,
    token: string
  ) {
    const response = await request(this.app.getHttpServer())
      .patch(`/workplaces/${workplaceId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send(updateWorkplaceDto)
      .expect(expectStatus);
    return response.body;
  }

  async sendDeleteWorkplaceRequest(workplaceId: number, expectStatus: HttpStatus, token: string) {
    const response = await request(this.app.getHttpServer())
      .delete(`/workplaces/${workplaceId}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(expectStatus);

    return response.body;
  }
}