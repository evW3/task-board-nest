import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class Workplaces1626097862205 implements MigrationInterface {
  name = 'Workplaces1626097862205'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'workplaces',
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
    await queryRunner.addColumn('workplaces', new TableColumn({
      name: 'user_id',
      type: 'int'
    }));
    await queryRunner.createForeignKey('workplaces', new TableForeignKey({
      columnNames: ['user_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE'
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('workplaces');
    const foreignKeyUser = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
    await queryRunner.dropForeignKey('workplaces', foreignKeyUser);
    await queryRunner.dropColumn('workplaces', 'user_id');
    await queryRunner.dropTable('workplaces');
  }
}
