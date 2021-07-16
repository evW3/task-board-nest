import { Injectable } from '@nestjs/common';
import { Connection, getConnection, QueryRunner } from 'typeorm';

@Injectable()
export class ProjectsMembersService {
  private queryRunner: QueryRunner;

  constructor() { this.init() }

  async saveProjectMember(projectId: number, userId: number) {
    await this.queryRunner.query(`INSERT INTO projects_members 
    (project_id, user_id) 
    VALUES (${projectId}, ${userId});`);
  }

  async getProjectsByUserId(userId: number) {
    return await this.queryRunner
      .query(`
      SELECT projects.id, projects.name
      FROM projects_members
      JOIN projects ON projects_members.project_id=projects.id
      WHERE projects_members.user_id=${userId}`);
  }

  async isExistsMember(projectId: number, userId: number) {
    return await this.queryRunner.query(`
      SELECT *
      FROM projects_members
      WHERE project_id=${projectId} AND user_id=${userId};
    `);
  }

  private init() {
    const connection: Connection = getConnection();

    this.queryRunner = connection.createQueryRunner();
  }
}