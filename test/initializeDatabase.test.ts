import * as tableColumns from "../json/tableColumns.json";
import {Datatable} from "../src/backend/database/Datatable";

import { getCards, writeCards, processPtCardList } from "../src/backend/ptCardOperations"

import * as fs from 'node:fs'
import { getDatabase, initializeDatabase } from "../src/backend/database/Database";


const currTime = Date.now();

// test('sandbox', async () => {

//   const db = await open({
//     filename: `E:\\ootp_data\\sqlite\\pt.db`,
//     driver: sqlite3.Database
//   });

//   await db.exec(tables[4].createTableString())

// })

const dir = 'E:\\ootp_data\\sqlite\\'

// test('test db init', async () => {
//   await initializeDatabase(['E:','ootp_data','sqlite',`${currTime}.db`]);
// })

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

    const db = getDatabase();

    const result = await db.get("SELECT COUNT(*) FROM PtCard");

    console.log(result);

})