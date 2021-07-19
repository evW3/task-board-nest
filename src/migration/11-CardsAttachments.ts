import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class CardsAttachments1626097862211 implements MigrationInterface {
  name = 'CardsAttachments1626097862211'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'cards_attachments',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          generationStrategy: 'increment',
          isGenerated: true
        },
        {
          name: 'attachment',
          type: 'bytea'
        }
      ]
    }), true);
    await queryRunner.addColumn('cards_attachments', new TableColumn({
      name: 'card_id',
      type: 'int'
    }));
    await queryRunner.createForeignKey('cards_attachments', new TableForeignKey({
      columnNames: ['card_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'cards',
      onDelete: 'CASCADE'
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('cards_attachments');
    const foreignKeyCard = table.foreignKeys.find(fk => fk.columnNames.indexOf('card_id') !== -1);
    await queryRunner.dropForeignKey('cards_attachments', foreignKeyCard);
    await queryRunner.dropColumn('cards_attachments', 'card_id');
    await queryRunner.dropTable('cards_attachments');
  }
}
