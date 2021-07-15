import { MigrationInterface, QueryRunner } from "typeorm";

export class RolesSeed1626097862201 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO roles (name) VALUES (\'USER\');`);
    await queryRunner.query(`INSERT INTO roles (name) VALUES (\'MANAGER\');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}