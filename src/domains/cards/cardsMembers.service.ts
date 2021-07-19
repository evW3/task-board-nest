import { Injectable } from '@nestjs/common';
import { Connection, getConnection, QueryRunner } from 'typeorm';

@Injectable()
export class CardsMembersService {
  private queryRunner: QueryRunner;

  constructor() { this.init() }

  async findCardMember(userId: number, cardId: number) {
    return await this.queryRunner.query(`
      SELECT *
      FROM cards_members
      WHERE user_id=${userId} AND card_id=${cardId};
    `);
  }

  async createCardMember(userId: number, cardId: number): Promise<void> {
    await this.queryRunner.query(`
      INSERT INTO cards_members 
      (user_id, card_id)
      VALUES (${userId}, ${cardId});
      `);
  }

  private init() {
    const connection: Connection = getConnection();

    this.queryRunner = connection.createQueryRunner();
  }
}