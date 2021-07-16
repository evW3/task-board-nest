import { Injectable } from '@nestjs/common';
import { Connection, getConnection, QueryRunner } from 'typeorm';

@Injectable()
export class UsersQueryRunnerService {
  private queryRunner: QueryRunner;

  constructor() { this.init(); }

  async getProjectOwner(userId: number, projectId: number) {

    return await this.queryRunner.query(`    
      SELECT u
      FROM users as u
      JOIN workplaces
      ON workplaces.user_id=u.id
      JOIN projects
      ON projects.workplace_id=workplaces.id
      WHERE u.id=${userId} AND projects.id=${projectId}
    `);
  }

  private init() {
    const connection: Connection = getConnection();

    this.queryRunner = connection.createQueryRunner();
  }
}