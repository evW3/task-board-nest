import { HttpStatus, INestApplication } from '@nestjs/common';
const request = require('supertest');

export class ProjectTesting {
  private app: INestApplication;
  private readonly workplaceId: number;

  constructor(app: INestApplication, workplaceId: number) {
    this.app = app;
    this.workplaceId = workplaceId;
  }

  private createPath() {
    return `/workplaces/${this.workplaceId}`
  }

  async sendCreateProjectRequest(createProjectDto: any, expectStatus: HttpStatus, token: string) {
    const response = await request(this.app.getHttpServer())
      .post(`${this.createPath()}/projects/`)
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
      .patch(`${this.createPath()}/projects/${projectId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send(updateProjectDto)
      .expect(expectStatus);

    return response.body;
  }

  async sendDeleteProjectRequest(projectId: number, expectStatus: HttpStatus, token: string) {
    const response = await request(this.app.getHttpServer())
      .delete(`${this.createPath()}/projects/${projectId}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(expectStatus);

    return response.body;
  }
}