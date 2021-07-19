import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class Cards1626097862209 implements MigrationInterface {
  name = 'Cards1626097862209'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'cards',
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
          name: 'description',
          type: 'text',
          isNullable: true
        },
        {
          name: 'date_interval_from',
          type: 'date'
        },
        {
          name: 'date_interval_to',
          type: 'date'
        }
      ]
    }), true);
    await queryRunner.addColumn('cards', new TableColumn({
      name: 'list_id',
      type: 'int'
    }));
    await queryRunner.createForeignKey('cards', new TableForeignKey({
      columnNames: ['list_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'lists',
      onDelete: 'CASCADE'
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('cards');
    const foreignKeyList= table.foreignKeys.find(fk => fk.columnNames.indexOf('list_id') !== -1);
    await queryRunner.dropForeignKey('cards', foreignKeyList);
    await queryRunner.dropColumn('cards', 'list_id');
    await queryRunner.dropTable('cards');
  }
}
