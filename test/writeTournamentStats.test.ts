import { databasePath } from "../settings.json"
import { Database } from "../src/backend/database/Database"
import { databaseObjectEqual } from "../src/utilities"
import * as path from "node:path"
import * as fs from "node:fs"

import { tournamentBattingStatsWriteScript } from "../src/backend/database/sqliteScripts"
import { convertHtmlFileToTournamentOutput } from "../src/backend/readHtmlStatsExport"
import { statsExport } from '../json/csvColumns.json'

beforeAll(async () => {
    fs.copyFileSync('.\\sqlite\\test.db','.\\test\\test.db');
});
  
afterAll(() => {
    fs.unlink('.\\test\\test.db', () => {});
});

test('tests that jest with typescript works', () => {
    expect([1,2,3].reduce((acc, curr) => acc + curr, 0)).toBe(6);
})

test('Populate PtCards table with record', async () => {

    const data = await convertHtmlFileToTournamentOutput({
        path: "D:\\OOTP Perfect Team\\js-ootpviewer\\test\\data",
        fileName: "tournament_data_1_rows.html",
    })

    const desiredData = [
        {
          "TM": "Florida",
          "CID": 62647,
          "G": 5,
          "GS": 5,
          "PA": 19,
          "AB": 19,
          "1B": 5,
          "2B": 1,
          "3B": 0,
          "HR": 1,
          "RBI": 1,
          "R": 4,
          "BB": 0,
          "IBB": 0,
          "HP": 0,
          "SH": 0,
          "SF": 0,
          "SO": 0,
          "GIDP": 1,
          "RC": 4.1,
          "wOBA": 0.410,
          "OPS+": 151,
          "BABIP": 0.353,
          "WPA": 0.12,
          "wRC+": 155,
          "WAR": 0.2,
          "PI/PA": 3.37,
          "SB": 0,
          "CS": 0,
          "BatR": 1.3,
          "wSB": 0.0,
          "UBR": -0.2
        },
        {
          "TM": "Abydos",
          "CID": 61741,
          "G": 7,
          "GS": 7,
          "PA": 29,
          "AB": 26,
          "1B": 5,
          "2B": 1,
          "3B": 0,
          "HR": 1,
          "RBI": 6,
          "R": 3,
          "BB": 3,
          "IBB": 0,
          "HP": 0,
          "SH": 0,
          "SF": 4,
          "SO": 2,
          "GIDP": 3,
          "RC": 3.2,
          "wOBA": 0.342,
          "OPS+": 107,
          "BABIP": 0.286,
          "WPA": -0.28,
          "wRC+": 110,
          "WAR": 0.1,
          "PI/PA": 3.48,
          "SB": 0,
          "CS": 0,
          "BatR": 0.4,
          "wSB": 0.0,
          "UBR": -0.6
        }
      ]
      

    const script = await tournamentBattingStatsWriteScript(data.stats,1);
    const db = new Database(".\\test\\test.db");

    const battingRecord1 = await db.get(`select * from BattingStats where PtCardID = ${1000}`)
    const battingRecord2 = await db.get(`select * from BattingStats where PtCardID = ${1000}`)

    expect(databaseObjectEqual(battingRecord1,desiredData[0])).toBeTruthy();
    expect(databaseObjectEqual(battingRecord2,desiredData[1])).toBeTruthy();

    console.log(script);

})