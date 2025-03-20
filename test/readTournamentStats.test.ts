import { databasePath } from "../settings.json"
import { Database } from "../src/backend/database/Database"
import { databaseObjectEqual } from "../src/utilities"
import * as path from "node:path"
import * as fs from "node:fs"

import { statsExport } from '../json/csvColumns.json'

beforeAll(async () => {
    fs.copyFileSync('E:\\ootp_data\\sqlite\\pt.db','E:\\ootp_data\\sqlite\\test.db');
});
  
afterAll(() => {
    fs.unlink('E:\\ootp_data\\sqlite\\test.db', () => {});
});

test("Load Batting stats for a tournament", async () => {

    const desiredData = [
        {
            "PtCardID": 1,
            "G": 49,
            "PA": 203,
            "H": 71,
            "HR": 9,
            "RBI": 29,
            "SB": 13,
            "WAR": 3.9
        },
        {
            "PtCardID": 2,
            "G": 29,
            "PA": 63,
            "H": 13,
            "HR": 5,
            "RBI": 29,
            "SB": 8,
            "WAR": 0.5
        }
    ]

    const loadSampleData = `insert into StatsBatch (Timestamp,Description,TournamentTypeID) values (unixepoch(),"",1);

insert into BattingStats (PtCardID,StatsBatchID,G,PA,H,HR,RBI,SB,WAR)
values
(1,1,5,65,34,5,10,4,0.5),
(1,1,10,34,15,3,6,1,1.5),
(1,1,34,104,22,1,13,8,1.9),
(2,1,12,25,2,3,11,6,0.7),
(2,1,17,38,11,2,18,2,-0.2);`

    const db = new Database("E:\\ootp_data\\sqlite\\test.db");
    await db.execute(loadSampleData);

})