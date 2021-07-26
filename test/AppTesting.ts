import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';

export class AppTesting {
  private App: INestApplication = null;

  async createTestApplication(): Promise<void> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.App = moduleFixture.createNestApplication();
  }

  async startTestServer(): Promise<void> {
    if(!this.App) {
      await this.createTestApplication();
    }

    await this.App.init();
  }

  get app(): INestApplication {
    return this.App;
  }

  getConnection() {
    return this.App.get(Connection);
  }
}
