import { databasePath } from "../settings.json"
import { Database } from "../src/backend/database/Database"
import { databaseObjectEqual } from "../src/utilities"
import * as path from "node:path"
import * as fs from "node:fs"

import { tournamentBattingStatsWriteScript, tournamentPitchingStatsWriteScript } from "../src/backend/database/sqliteScripts"
import { HtmlStatsTool } from "../src/backend/readHtmlStatsExport"
import { statsExport } from '../json/csvColumns.json'

import {PtDataStatsFile} from "../src/types"

beforeAll(async () => {
    fs.copyFileSync('E:\\ootp_data\\sqlite\\pt.db','E:\\ootp_data\\sqlite\\test.db');
});
  
afterAll(() => {
    fs.unlink('E:\\ootp_data\\sqlite\\test.db', () => {});
});

// test('Populate BattingStats table with record', async () => {

//     const tool =new HtmlStatsTool(["E:","ootp_data","sqlite","test.db"]);
//     await tool.handleTournamentStatsWrite({
//       key:0,
//       isSuccess:false,
//       ptFolder:"",
//       path:"D:\\OOTP Perfect Team\\js-ootpviewer\\test\\data",
//       fileName:"tournament_data_2_rows.html",
//       description: "This is a test!",
//       tournamentTypeID: 1,
//       isCumulativeFlag: false,
//     }, null)

//     const desiredData = [
//         {
//           "PtCardID": 1,
//           "TeamName": "Florida",
//           "G": 5,
//           "GS": 5,
//           "PA": 19,
//           "AB": 19,
//           "1B": 5,
//           "2B": 1,
//           "3B": 0,
//           "HR": 1,
//           "RBI": 1,
//           "R": 4,
//           "BB": 0,
//           "IBB": 0,
//           "HP": 0,
//           "SH": 0,
//           "SF": 0,
//           "SO": 1,
//           "GIDP": 0,
//           "RC": 4.1,
//           "wOBA": 0.410,
//           "OPS+": 151,
//           "BABIP": 0.353,
//           "WPA": 0.12,
//           "wRC+": 155,
//           "WAR": 0.2,
//           "PI/PA": 3.37,
//           "SB": 0,
//           "CS": 0,
//           "BatR": 1.3,
//           "wSB": 0.0,
//           "UBR": -0.2
//         },
//         {
//           "PtCardID": 2319,
//           "TeamName": "Abydos",
//           "G": 7,
//           "GS": 7,
//           "PA": 29,
//           "AB": 26,
//           "1B": 5,
//           "2B": 1,
//           "3B": 0,
//           "HR": 1,
//           "RBI": 6,
//           "R": 3,
//           "BB": 3,
//           "IBB": 0,
//           "HP": 0,
//           "SH": 0,
//           "SF": 0,
//           "SO": 4,
//           "GIDP": 2,
//           "RC": 3.2,
//           "wOBA": 0.342,
//           "OPS+": 107,
//           "BABIP": 0.286,
//           "WPA": -0.28,
//           "wRC+": 110,
//           "WAR": 0.1,
//           "PI/PA": 3.48,
//           "SB": 0,
//           "CS": 0,
//           "BatR": 0.4,
//           "wSB": 0.0,
//           "UBR": -0.6
//         }
//     ]
        
//     const db = new Database("E:\\ootp_data\\sqlite\\test.db");

//     const battingRecord1 = await db.get(`select * from main.BattingStats where PtCardID = 1`)
//     const battingRecord2 = await db.get(`select * from main.BattingStats where PtCardID = 2319`)

//     expect(battingRecord1).toBeTruthy();
//     expect(battingRecord2).toBeTruthy();

//     expect(databaseObjectEqual(battingRecord1,desiredData[0])).toBeTruthy();
//     expect(databaseObjectEqual(battingRecord2,desiredData[1])).toBeTruthy();

// })

// test('Populate PitchingStats table with pitching records', async () => {

//   const tool =new HtmlStatsTool(["E:","ootp_data","sqlite","test.db"]);
//   await tool.handleTournamentStatsWrite({
//     key:0,
//     isSuccess:false,
//     ptFolder:"",
//     path:"D:\\OOTP Perfect Team\\js-ootpviewer\\test\\data",
//     fileName:"tournament_pitching_data_2_rows.html",
//     description: "This is a test!",
//     tournamentTypeID: 1,
//     isCumulativeFlag: false,
//   }, null)

//   const desiredData = [
//     {
//       "PtCardID": 483,
//       "G": 1,
//       "GS": 1,
//       "W": 1,
//       "L": 0,
//       "WIN%": 1.000,
//       "SVO": 0,
//       "SV": 0,
//       "SV%": .000,
//       "BS": 0,
//       "BS%": .000,
//       "HLD": 0,
//       "SD": 0,
//       "MD": 0,
//       "IP": 7.0,
//       "BF": 26,
//       "AB": 26,
//       "HA": 4,
//       "1B": 2,
//       "2B": 1,
//       "3B": 1,
//       "HR": 0,
//       "TB": 7,
//       "R": 2,
//       "ER": 1,
//       "BB": 0,
//       "IBB": 0,
//       "K": 6,
//       "HP": 0,
//       "ERA": 1.29,
//       "AVG": .154,
//       "OBP": .154,
//       "SLG": .269,
//       "OPS": .423,
//       "BABIP": .200,
//       "WHIP": 0.57,
//       "BRA/9": 5.1,
//       "HR/9": 0.0,
//       "H/9": 5.1,
//       "BB/9": 0.0,
//       "K/9": 7.7,
//       "K/BB": 0.0,
//       "K%": 23.1,
//       "BB%": 0.0,
//       "K%-BB%": 23.1,
//       "SH": 0,
//       "SF": 0,
//       "WP": 0,
//       "BK": 0,
//       "CI": 0,
//       "DP": 0,
//       "RA": 0,
//       "GF": 0,
//       "IR": 0,
//       "IRS": 0,
//       "IRS%": 0.0,
//       "LOB%": 50.0,
//       "pLi": 0.88,
//       "GF%": 0.0,
//       "QS": 1,
//       "QS%": 1.000,
//       "CG": 0,
//       "CG%": 0.0,
//       "SHO": 0,
//       "PPG": 100,
//       "RS": 4,
//       "RSG": 4.0,
//       "PI": 100,
//       "GB": 7,
//       "FB": 8,
//       "GO%": 0.47,
//       "SB": 0,
//       "CS": 0,
//       "ERA+": 323,
//       "FIP": 1.61,
//       "FIP-": 38,
//       "WPA": 0.1,
//       "WAR": 0.4,
//       "rWAR": 0.3,
//       "SIERA": 2.60
//     },
//     {
//       "PtCardID": 327,
//       "G": 4,
//       "GS": 0,
//       "W": 0,
//       "L": 0,
//       "WIN%": 0.000,
//       "SVO": 0,
//       "SV": 0,
//       "SV%": .000,
//       "BS": 0,
//       "BS%": .000,
//       "HLD": 1,
//       "SD": 0,
//       "MD": 1,
//       "IP": 5.1,
//       "BF": 25,
//       "AB": 21,
//       "HA": 5,
//       "1B": 4,
//       "2B": 0,
//       "3B": 0,
//       "HR": 1,
//       "TB": 8,
//       "R": 3,
//       "ER": 3,
//       "BB": 3,
//       "IBB": 0,
//       "K": 6,
//       "HP": 1,
//       "ERA": 5.06,
//       "AVG": .238,
//       "OBP": .360,
//       "SLG": .381,
//       "OPS": .741,
//       "BABIP": .286,
//       "WHIP": 1.50,
//       "BRA/9": 15.2,
//       "HR/9": 1.7,
//       "H/9": 8.4,
//       "BB/9": 5.1,
//       "K/9": 10.1,
//       "K/BB": 2.0,
//       "K%": 24.0,
//       "BB%": 12.0,
//       "K%-BB%": 12.0,
//       "SH": 0,
//       "SF": 0,
//       "WP": 0,
//       "BK": 0,
//       "CI": 0,
//       "DP": 0,
//       "RA": 4,
//       "GF": 0,
//       "IR": 4,
//       "IRS": 0,
//       "IRS%": 0.0,
//       "LOB%": 78.9,
//       "pLi": 1.08,
//       "GF%": .000,
//       "QS": 0,
//       "QS%": 0.0,
//       "CG": 0,
//       "CG%": 0.0,
//       "SHO": 0,
//       "PPG": 23,
//       "RS": 0.0,
//       "RSG": 0.0,
//       "PI": 95,
//       "GB": 4,
//       "FB": 6,
//       "GO%": 0.4,
//       "SB": 0,
//       "CS": 0,
//       "ERA+": 82,
//       "FIP": 5.76,
//       "FIP-": 138,
//       "WPA": 0.0,
//       "WAR": -0.1,
//       "rWAR": 0.0,
//       "SIERA": 3.84
//     }
//   ]
       
//   const db = new Database("E:\\ootp_data\\sqlite\\test.db");

//   const pitchingRecord1 = await db.get(`select * from main.PitchingStats where PtCardID = 483`)
//   const pitchingRecord2 = await db.get(`select * from main.PitchingStats where PtCardID = 327`)

//   expect(databaseObjectEqual(pitchingRecord1,desiredData[0])).toBeTruthy();
//   expect(databaseObjectEqual(pitchingRecord2,desiredData[1])).toBeTruthy();

// })

test('Create a StatsBatch record', async () => {
  
  const db = ['E:','ootp_data','sqlite','test.db'];
  const record = {"Year":"2025"};

  const statsBatchID = await new HtmlStatsTool(db).createStatsBatch(JSON.stringify(record), 1)
  
  const databaseRecord = await new Database(path.join(...db)).getMapped<{Description:string}>(`select Description from StatsBatch where StatsBatchID=${statsBatchID}`)
  
  expect(JSON.stringify(record) === databaseRecord.Description).toBeTruthy();

})