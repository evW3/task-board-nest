import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class CardsActivities1626097862212 implements MigrationInterface {
  name = 'CardsActivities1626097862212'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'cards_activities',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          generationStrategy: 'increment',
          isGenerated: true
        },
        {
          name: 'message',
          type: 'text'
        },
        {
          name: 'date',
          type: 'date'
        }
      ]
    }), true);
    await queryRunner.addColumn('cards_activities', new TableColumn({
      name: 'card_id',
      type: 'int'
    }));
    await queryRunner.createForeignKey('cards_activities', new TableForeignKey({
      columnNames: ['card_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'cards',
      onDelete: 'CASCADE'
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('cards_activities');
    const foreignKeyCard = table.foreignKeys.find(fk => fk.columnNames.indexOf('card_id') !== -1);
    await queryRunner.dropForeignKey('cards_activities', foreignKeyCard);
    await queryRunner.dropColumn('cards_activities', 'card_id');
    await queryRunner.dropTable('cards_activities');
  }
}
