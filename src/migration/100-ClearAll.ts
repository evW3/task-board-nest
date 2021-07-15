import { MigrationInterface, QueryRunner} from 'typeorm';
import { Roles1626097862200 } from './00-Roles';
import { Users1626097862202 } from './02-Users';
import { Permissions1626097862203 } from './03-Permissions';
import { RolesPermissions1626097862204 } from './04-RolesPermissions';
import { Workplaces1626097862205 } from './05-Workplaces';
import { Projects1626097862206 } from './06-Projects';


export class ClearAll1626097862300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {}

  public async down(queryRunner: QueryRunner): Promise<void> {
    const rolesEntity = new Roles1626097862200();
    const usersEntity = new Users1626097862202();
    const permissionsEntity = new Permissions1626097862203();
    const rolePermissions = new RolesPermissions1626097862204();
    const workplaceEntity = new Workplaces1626097862205();
    const projectsEntity = new Projects1626097862206();

    await projectsEntity.down(queryRunner);
    await workplaceEntity.down(queryRunner);
    await usersEntity.down(queryRunner);
    await rolePermissions.down(queryRunner);
    await rolesEntity.down(queryRunner);
    await permissionsEntity.down(queryRunner);

    await queryRunner.clearTable('migrations');
  }
}