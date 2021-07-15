import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class Projects1626097862206 implements MigrationInterface {
  name = 'Projects1626097862206'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'projects',
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
    await queryRunner.addColumn('projects', new TableColumn({
      name: 'workplace_id',
      type: 'int'
    }));
    await queryRunner.createForeignKey('projects', new TableForeignKey({
      columnNames: ['workplace_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'workplaces',
      onDelete: 'CASCADE'
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('projects');
    const foreignKeyWorkplace = table.foreignKeys.find(fk => fk.columnNames.indexOf('workplace_id') !== -1);
    await queryRunner.dropForeignKey('projects', foreignKeyWorkplace);
    await queryRunner.dropColumn('projects', 'workplace_id');
    await queryRunner.dropTable('projects');
  }
}
