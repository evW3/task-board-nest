import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';;

export class RolesPermissions1626097862204 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({name: 'roles_permission'}), true);
        await queryRunner.addColumn('roles_permission', new TableColumn({
            name: 'role_id',
            type: 'int'
        }));
        await queryRunner.addColumn('roles_permission', new TableColumn({
            name: 'permission_id',
            type: 'int'
        }));
        await queryRunner.createForeignKey('roles_permission', new TableForeignKey({
            columnNames: ['role_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'roles'
        }));
        await queryRunner.createForeignKey('roles_permission', new TableForeignKey({
            columnNames: ['permission_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'permissions'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('roles_permission');
        const foreignKeyRole = table.foreignKeys.find(fk => fk.columnNames.indexOf('role_id') !== -1);
        const foreignKeyPermission = table.foreignKeys.find(fk => fk.columnNames.indexOf('permission_id') !== -1);
        await queryRunner.dropForeignKey('roles_permission', foreignKeyRole);
        await queryRunner.dropForeignKey('roles_permission', foreignKeyPermission);
        await queryRunner.dropColumn('roles_permission', 'role_id');
        await queryRunner.dropColumn('roles_permission', 'permission_id');
        await queryRunner.dropTable('roles_permission');
    }
}