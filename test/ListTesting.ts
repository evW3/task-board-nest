import { HttpStatus, INestApplication } from '@nestjs/common';
const request = require('supertest');

export class ListTesting {
  private app: INestApplication;
  private readonly workplaceId: number;
  private readonly projectId: number;

  constructor(app: INestApplication, workplaceId: number, projectId: number) {
    this.app = app;
    console.log(workplaceId);
    this.workplaceId = workplaceId;
    this.projectId = projectId;
  }

  private createPath() {
    return `/workplaces/${this.workplaceId}/projects/${this.projectId}`
  }

  async sendCreateListRequest(createProjectDto: any, expectStatus: HttpStatus, token: string) {
    const response = await request(this.app.getHttpServer())
      .post(`${this.createPath()}/lists/`)
      .set({ Authorization: `Bearer ${token}` })
      .send(createProjectDto)
      .expect(expectStatus);

    return response.body;
  }

  async sendUpdateProjectRequest(
    updateProjectDto: any,
    projectId: number,
    expectStatus: HttpStatus,
    token: string
  ) {
    const response = await request(this.app.getHttpServer())
      .patch(`${this.createPath()}/lists/${projectId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send(updateProjectDto)
      .expect(expectStatus);

    return response.body;
  }

  async sendDeleteProjectRequest(projectId: number, expectStatus: HttpStatus, token: string) {
    const response = await request(this.app.getHttpServer())
      .delete(`${this.createPath()}/lists/${projectId}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(expectStatus);

    return response.body;
  }
}