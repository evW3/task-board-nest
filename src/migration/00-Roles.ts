import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Roles1626097862200 implements MigrationInterface {
  name = 'Roles1626097862200'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
        name: 'roles',
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
    await queryRunner.dropTable('roles');
  }

}
