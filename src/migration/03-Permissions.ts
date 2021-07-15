import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class Permissions1626097862203 implements MigrationInterface {
  name = 'Permissions1626097862203'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'permissions',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          generationStrategy: 'increment',
          isGenerated: true
        },
        {
          name: 'name',
          type: 'text'
        }
      ]
    }), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('permissions');
  }
}
