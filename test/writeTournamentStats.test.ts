import { databasePath } from "../settings.json"
import { Database } from "../src/backend/database/Database"
import { databaseObjectEqual } from "../src/utilities"
import * as path from "node:path"
import * as fs from "node:fs"

import { tournamentBattingStatsWriteScript } from "../src/backend/database/sqliteScripts"
import { writeTournamentStats,convertHtmlFileToTournamentOutput } from "../src/backend/readHtmlStatsExport"
import { statsExport } from '../json/csvColumns.json'

beforeAll(async () => {
    fs.copyFileSync('E:\\ootp_data\\sqlite\\pt.db','E:\\ootp_data\\sqlite\\test.db');
});
  
afterAll(() => {
    fs.unlink('E:\\ootp_data\\sqlite\\test.db', () => {});
});

test('tests that jest with typescript works', () => {
    expect([1,2,3].reduce((acc, curr) => acc + curr, 0)).toBe(6);
})

test('Populate PtCards table with record', async () => {

    const data = await convertHtmlFileToTournamentOutput({
        path: "D:\\OOTP Perfect Team\\js-ootpviewer\\test\\data",
        fileName: "tournament_data_2_rows.html",
    })

    const script = tournamentBattingStatsWriteScript(data.stats, 1, 1)

    const desiredData = [
        {
          "PtCardID": 1,
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
          "SO": 1,
          "GIDP": 0,
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
          "PtCardID": 2319,
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
          "SF": 0,
          "SO": 4,
          "GIDP": 2,
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
        
    const db = new Database("E:\\ootp_data\\sqlite\\test.db");
    await db.execute(script);

    const battingRecord1 = await db.get(`select * from main.BattingStats where PtCardID = 1`)
    const battingRecord2 = await db.get(`select * from main.BattingStats where PtCardID = 2319`)

    expect(databaseObjectEqual(battingRecord1,desiredData[0])).toBeTruthy();
    expect(databaseObjectEqual(battingRecord2,desiredData[1])).toBeTruthy();

})