import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class Lists1626097862208 implements MigrationInterface {
  name = 'Lists1626097862208'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'lists',
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
        },
        {
          name: 'position',
          type: 'int'
        }
      ]
    }), true);
    await queryRunner.addColumn('lists', new TableColumn({
      name: 'project_id',
      type: 'int'
    }));
    await queryRunner.createForeignKey('lists', new TableForeignKey({
      columnNames: ['project_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'projects',
      onDelete: 'CASCADE'
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('lists');
    const foreignKeyProject = table.foreignKeys.find(fk => fk.columnNames.indexOf('project_id') !== -1);
    await queryRunner.dropForeignKey('lists', foreignKeyProject);
    await queryRunner.dropColumn('lists', 'project_id');
    await queryRunner.dropTable('lists');
  }
}
