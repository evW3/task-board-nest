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
  }

  async changePositionWithJoin(
    parentTable: string,
    parentId: number,
    childTable: string,
    positionTo: number,
    positionFrom: number
  ) {
    let parentIdColumnName: any = parentTable.split('').reverse();
    delete parentIdColumnName[0];
    parentIdColumnName = `${parentIdColumnName.reverse().join('')}_id`;

    await this.queryRunner.query(`
      UPDATE ${childTable} 
      SET position = ${childTable}.position - 1
      WHERE ${childTable}.position <= ${positionTo} 
      AND ${childTable}.position > ${positionFrom} 
      AND ${childTable}.${parentIdColumnName}=${parentId};
    `);
  }

  async increasePositionWithJoin(
    parentTable: string,
    parentId: number,
    childTable: string,
    positionTo: number,
    positionFrom: number
  ) {
    let parentIdColumnName: any = parentTable.split('').reverse();
    delete parentIdColumnName[0];
    parentIdColumnName = `${parentIdColumnName.reverse().join('')}_id`;

    await this.queryRunner.query(`
      UPDATE ${childTable} 
      SET position = ${childTable}.position + 1 
      WHERE ${childTable}.position >= ${positionTo} 
      AND ${childTable}.position <= ${positionFrom}
      AND ${childTable}.${parentIdColumnName}=${parentId};
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

  async decreaseOrIncreaseInPositions(
    parentTable: string,
    childTable: string,
    parentId: number,
    position: number,
    isDecreaseMode: boolean
  ) {
    let parentIdColumnName: any = parentTable.split('').reverse();
    delete parentIdColumnName[0];
    const sign = isDecreaseMode ? '-' : '+';
    parentIdColumnName = `${parentIdColumnName.reverse().join('')}_id`;

    await this.queryRunner.query(`
      UPDATE ${childTable} 
      SET position = ${childTable}.position ${sign} 1 
      FROM ${parentTable}
      JOIN ${childTable} AS c ON ${parentTable}.id = c.${parentIdColumnName} 
      WHERE ${childTable}.position >= ${position} AND ${childTable}.${parentIdColumnName} = ${parentId};
    `);
  }

  async getEntityByPosition(parentTable: string, childTable: string, parentId: number, position: number) {
    let parentIdColumnName: any = parentTable.split('').reverse();
    delete parentIdColumnName[0];
    parentIdColumnName = `${parentIdColumnName.reverse().join('')}_id`;

    return await this.queryRunner.query(`
      SELECT *
      FROM ${parentTable}
      JOIN ${childTable} ON ${childTable}.${parentIdColumnName} = ${parentTable}.id
      WHERE ${parentTable}.id = ${parentId} AND ${childTable}.position = ${position}
     `);
  }

  async increaseWith(
    parentTable: string,
    childTable: string,
    parentId: number,
    positionTo: number,
    positionFrom: number
  ) {
    let parentIdColumnName: any = parentTable.split('').reverse();
    delete parentIdColumnName[0];
    parentIdColumnName = `${parentIdColumnName.reverse().join('')}_id`;

    await this.queryRunner.query(`
      UPDATE ${childTable} 
      SET position = ${childTable}.position + 1 
      FROM ${parentTable}
      JOIN ${childTable} AS c ON ${parentTable}.id = c.${parentIdColumnName} 
      WHERE ${childTable}.position >= ${positionTo} 
      AND ${childTable}.position <= ${positionFrom}
      AND ${childTable}.${parentIdColumnName} = ${parentId};
    `);
  }

  private init() {
    const connection: Connection = getConnection();

    this.queryRunner = connection.createQueryRunner();
  }
}