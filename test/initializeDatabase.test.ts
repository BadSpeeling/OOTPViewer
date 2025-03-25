import * as tableColumns from "../json/tableColumns.json";
import {Datatable} from "../src/backend/database/Datatable";

import { getCards, writeCards, processPtCardList } from "../src/backend/ptCardOperations"

import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import * as fs from 'node:fs'

const isTemporaryFlag = false;
const tableNames = ["PtCard","LiveUpdate","CardMarketValue","StatsBatch","TournamentType","BattingStats","PitchingStats"];
const tables = tableNames.map((tableName) => new Datatable(tableName, isTemporaryFlag, tableColumns[tableName]));

const currTime = Date.now();

// test('sandbox', async () => {

//   const db = await open({
//     filename: `E:\\ootp_data\\sqlite\\pt.db`,
//     driver: sqlite3.Database
//   });

//   await db.exec(tables[4].createTableString())

// })

const dir = 'E:\\ootp_data\\sqlite\\'

test('tests that jest with typescript works', async () => {
        
    fs.closeSync(fs.openSync(dir + `${currTime}.db`, 'a+'));

    const db = await open({
        filename: dir + `${currTime}.db`,
        driver: sqlite3.Database
      });
  
      await db.exec(tables.map((table) => table.createTableString()).join(""));
      await db.close();

})

// test('Run table load', async () => {
  
//   //const currTime = 1742076082472;

//   const cards = await getCards("C:\\Users\\ericf\\OneDrive\\Documents\\Out of the Park Developments\\OOTP Baseball 26\\online_data\\pt_card_list.csv")
//   await writeCards(`C:\\Users\\efrye\\Documents\\data\\${currTime}.db`,cards)

//   const db = await open({
//       filename: `C:\\Users\\efrye\\Documents\\data\\${currTime}.db`,
//       driver: sqlite3.Database
//     });

//   const result = await db.get("SELECT COUNT(*) cnt FROM PtCard");

//   expect(result["cnt"] === cards.length).toBeTruthy();

//   //console.log(result);

// })

test('Run table load', async () => {
    await processPtCardList();

    const db = await open({
        filename: `E:\\ootp_data\\sqlite\\pt.db`,
        driver: sqlite3.Database
      });

    const result = await db.get("SELECT COUNT(*) FROM PtCard");

    console.log(result);

})