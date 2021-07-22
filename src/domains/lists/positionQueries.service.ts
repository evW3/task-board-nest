import { Injectable } from '@nestjs/common';
import { Connection, getConnection, QueryRunner } from 'typeorm';

@Injectable()
export class PositionQueriesService {
  private queryRunner: QueryRunner;

  constructor() { this.init() }

  async changePosition(positionTo: number, tableName: string, positionFrom: number): Promise<void> {
      await this.queryRunner.query(`
        UPDATE ${tableName}
        SET position = position - 1
        WHERE position <= ${positionTo} AND position > ${positionFrom};
      `);
      await this.queryRunner.query(`
        UPDATE ${tableName}
        SET position = position + 1
        WHERE position > ${positionTo};
      `);

  }

  async changePositionWithJoin(parentTable: string, parentId: number, childTable: string, positionTo: number, positionFrom: number) {
    let parentIdColumnName: any = parentTable.split('').reverse();
    delete parentIdColumnName[0];
    parentIdColumnName = `${parentIdColumnName.reverse().join('')}_id`;
    
    await this.queryRunner.query(`
      UPDATE ${childTable} 
      SET position = ${childTable}.position + 1 
      FROM ${parentTable} 
      JOIN ${childTable} AS c ON ${parentTable}.id = c.${parentIdColumnName} 
      WHERE c.position > ${positionTo} AND ${parentTable}.id=${parentId};
    `);

    await this.queryRunner.query(`
      UPDATE ${childTable} 
      SET position = ${childTable}.position - 1 
      FROM ${parentTable} 
      JOIN ${childTable} AS c ON ${parentTable}.id = c.${parentIdColumnName} 
      WHERE c.position <= ${positionTo} AND c.position > ${positionFrom} AND ${parentTable}.id=${parentId};
    `);
  } 

  async getMaxOrMinPosition(tableName: string, projectId: number, joinTable: string, MaxMin: string) {
    let tableId: any = tableName.split('').reverse();
    delete tableId[0];
    tableId = `${tableId.reverse().join('')}_id`;
    
    return await this.queryRunner.query(`
      SELECT ${MaxMin}(jt.position) AS position 
      FROM ${tableName}
      JOIN ${joinTable} AS jt ON ${tableName}.id = jt.${tableId}
      WHERE ${tableName}.id = ${projectId}
    `);
  }

  private init() {
    const connection: Connection = getConnection();

    this.queryRunner = connection.createQueryRunner();
  }
}