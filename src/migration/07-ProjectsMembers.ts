import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class ProjectsMembers1626097862207 implements MigrationInterface {
  name = 'ProjectsMembers1626097862207'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({name: 'projects_members'}), true);
    await queryRunner.addColumn('projects_members', new TableColumn({
      name: 'user_id',
      type: 'int'
    }));
    await queryRunner.addColumn('projects_members', new TableColumn({
      name: 'project_id',
      type: 'int'
    }));
    await queryRunner.createForeignKey('projects_members', new TableForeignKey({
      columnNames: ['user_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE'
    }));
    await queryRunner.createForeignKey('projects_members', new TableForeignKey({
      columnNames: ['project_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'projects',
      onDelete: 'CASCADE'
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('projects_members');
    const foreignKeyUser = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
    const foreignKeyProject = table.foreignKeys.find(fk => fk.columnNames.indexOf('project_id') !== -1);
    await queryRunner.dropForeignKey('projects_members', foreignKeyUser);
    await queryRunner.dropForeignKey('projects_members', foreignKeyProject);
    await queryRunner.dropColumn('projects_members', 'user_id');
    await queryRunner.dropColumn('projects_members', 'project_id');
    await queryRunner.dropTable('projects_members');
  }
}
