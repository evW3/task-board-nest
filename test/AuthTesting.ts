import { HttpStatus, INestApplication } from '@nestjs/common';
const request = require('supertest');

export class AuthTesting {
  private app: INestApplication;
  constructor(app: INestApplication) {
    this.app = app;
  }

  async sendRegisterRequest(registerDto: any, expectStatus: HttpStatus) {
    const response = await request(this.app.getHttpServer())
      .post(`/auth/sign-up`)
      .send(registerDto)
      .expect(expectStatus);

    return response.body.token;
  }

  async sendAuthRequest(authDto: any, expectStatus: HttpStatus) {
    const response = await request(this.app.getHttpServer())
      .post(`/auth/sign-in`)
      .send(authDto)
      .expect(expectStatus);

    return response.body.token;
  }
}