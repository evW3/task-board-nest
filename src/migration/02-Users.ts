import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class Users1626097862202 implements MigrationInterface {
  name = 'Users1626097862202'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
        name: 'users',
        columns: [
            {
                name: 'id',
                type: 'int',
                isPrimary: true,
                generationStrategy: 'increment',
                isGenerated: true
            },
            {
                name: 'email',
                type: 'text'
            },
            {
                name: 'password',
                type: 'text'
            },
            {
                name: 'password_salt',
                type: 'text'
            },
            {
                name: 'full_name',
                type: 'text'
            }
        ]
    }), true);
    await queryRunner.addColumn('users', new TableColumn({
        name: 'role_id',
        type: 'int'
    }));
    await queryRunner.createForeignKey('users', new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'SET NULL'
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    const foreignKeyRole = table.foreignKeys.find(fk => fk.columnNames.indexOf('role_id') !== -1);
    await queryRunner.dropForeignKey('users', foreignKeyRole);
    await queryRunner.dropColumn('users', 'role_id');
    await queryRunner.dropTable('users');
  }
}
