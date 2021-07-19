import { MigrationInterface, QueryRunner} from 'typeorm';
import { Roles1626097862200 } from './00-Roles';
import { Users1626097862202 } from './02-Users';
import { Permissions1626097862203 } from './03-Permissions';
import { RolesPermissions1626097862204 } from './04-RolesPermissions';
import { Workplaces1626097862205 } from './05-Workplaces';
import { Projects1626097862206 } from './06-Projects';
import { ProjectsMembers1626097862207 } from './07-ProjectsMembers';
import { Lists1626097862208 } from './08-Lists';
import { Cards1626097862209 } from './09-Cards';
import { CardsMembers1626097862210 } from './10-CardsMembers';
import { CardsAttachments1626097862211 } from './11-CardsAttachments';
import { CardsActivities1626097862212 } from './12-CardsActivity';


export class ClearAll1626097862300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {}

  public async down(queryRunner: QueryRunner): Promise<void> {
    const rolesEntity = new Roles1626097862200();
    const usersEntity = new Users1626097862202();
    const permissionsEntity = new Permissions1626097862203();
    const rolePermissions = new RolesPermissions1626097862204();
    const workplaceEntity = new Workplaces1626097862205();
    const projectsEntity = new Projects1626097862206();
    const projectsMembersEntity = new ProjectsMembers1626097862207();
    const listEntity = new Lists1626097862208();
    const cardsEntity = new Cards1626097862209();
    const cardsMembersEntity = new CardsMembers1626097862210();
    const cardsAttachmentEntity = new CardsAttachments1626097862211();
    const cardsActivitiesEntity = new CardsActivities1626097862212();

    //await cardsActivitiesEntity.down(queryRunner);
    await cardsAttachmentEntity.down(queryRunner);
    await cardsMembersEntity.down(queryRunner);
    await cardsEntity.down(queryRunner);
    await listEntity.down(queryRunner);
    await projectsMembersEntity.down(queryRunner);
    await projectsEntity.down(queryRunner);
    await workplaceEntity.down(queryRunner);
    await usersEntity.down(queryRunner);
    await rolePermissions.down(queryRunner);
    await rolesEntity.down(queryRunner);
    await permissionsEntity.down(queryRunner);

    await queryRunner.clearTable('migrations');
  }
}