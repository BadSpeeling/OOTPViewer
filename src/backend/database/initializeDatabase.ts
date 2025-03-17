import * as tableColumns from "../../../json/tableColumns.json";
import {Datatable} from "./Datatable";

import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const isTemporaryFlag = false;
const tableNames = ["PtCard","LiveUpdate","CardMarketValue","BattingStats"];
const tables = tableNames.map((tableName) => new Datatable(tableName, isTemporaryFlag, tableColumns[tableName]));
  
// this is a top-level await 
(async () => {
    // open the database
    const db = await open({
      filename: 'E:\\ootp_data\\sqlite\\test.db',
      driver: sqlite3.Database
    });

    await db.exec(tables.map((table) => table.createTableString()).join(""));
    await db.close();

})()