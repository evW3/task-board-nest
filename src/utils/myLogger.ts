import fs from 'fs';
import path from'path';
import { Lists } from 'src/domains/lists/lists.model';
import {v4 as uuid} from 'uuid';

export class MyLogger {
  private fileName: string;

  constructor() {
    const rootDir = path.resolve(__dirname, '..', '..', 'logs');

    if (!fs.existsSync(rootDir)) {
      fs.mkdirSync(rootDir);
    }
    this.fileName = `./logs/${uuid()}.txt`;
  }

  log(
    params: any,
    cardIdToMove: number,
    listIdMoveFrom: number,
    listsBefore: Lists[],
    listsAfter: Lists[]
  ) {
    fs.appendFile(
      `${this.fileName}`, 
      `
        [CARDID]: ${cardIdToMove}\n
        [LISTID]: ${listIdMoveFrom}\n
        [WITH PARAMS]: ${JSON.stringify(params)}\n
        [BEFORE]\n
        ${JSON.stringify(listsBefore, null, ' ')}\n
        [AFTER]\n
        ${JSON.stringify(listsAfter, null, ' ')}
      `,
      err => {
        if(!err)
          console.log('Saved!');
      }
    );
  }
}
