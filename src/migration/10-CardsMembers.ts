import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class CardsMembers1626097862210 implements MigrationInterface {
  name = 'CardsMembers1626097862210'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({name: 'cards_members'}), true);
    await queryRunner.addColumn('cards_members', new TableColumn({
      name: 'user_id',
      type: 'int'
    }));
    await queryRunner.addColumn('cards_members', new TableColumn({
      name: 'card_id',
      type: 'int'
    }));
    await queryRunner.createForeignKey('cards_members', new TableForeignKey({
      columnNames: ['user_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE'
    }));
    await queryRunner.createForeignKey('cards_members', new TableForeignKey({
      columnNames: ['card_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'cards',
      onDelete: 'CASCADE'
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('cards_members');
    const foreignKeyUser = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
    const foreignKeyCard = table.foreignKeys.find(fk => fk.columnNames.indexOf('card_id') !== -1);
    await queryRunner.dropForeignKey('cards_members', foreignKeyUser);
    await queryRunner.dropForeignKey('cards_members', foreignKeyCard);
    await queryRunner.dropColumn('cards_members', 'user_id');
    await queryRunner.dropColumn('cards_members', 'card_id');
    await queryRunner.dropTable('cards_members');
  }
}
