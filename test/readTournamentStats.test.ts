import { databasePath } from "../settings.json"
import { Database } from "../src/backend/database/Database"
import { databaseObjectEqual } from "../src/utilities"
import * as path from "node:path"
import * as fs from "node:fs"

import { getTournamentBattingStats, getTournamentPitchingStats } from "../src/backend/readTournamentStats"

beforeAll(async () => {
    fs.copyFileSync('E:\\ootp_data\\sqlite\\pt.db','E:\\ootp_data\\sqlite\\test.db');

    const db = new Database("E:\\ootp_data\\sqlite\\test.db");
    await db.execute('insert into StatsBatch (Timestamp,Description,TournamentTypeID) values (unixepoch(),"",1);');

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

    const battingsStatsScript = getTournamentBattingStats(1);
    const battingStats = await db.getAll(battingsStatsScript);

    const card1Stats = battingStats.find((stats) => stats.PtCardID === 1);
    const card2Stats = battingStats.find((stats) => stats.PtCardID === 2);
    
    expect(databaseObjectEqual(card1Stats,desiredData.find((data) => data.PtCardID === 1))).toBeTruthy();
    expect(databaseObjectEqual(card2Stats,desiredData.find((data) => data.PtCardID === 2))).toBeTruthy();

})

test("Load Pitching stats for a tournament", async () => {

    const desiredData = [
        {
            "PtCardID": 1,
            "G": 36,
            "GS": 15,
            "IP": 58,
            "K": 28,
            "BB": 10,
            "WAR": 1.7
        },
        {
            "PtCardID": 2,
            "G": 22,
            "GS": 17,
            "IP": 61.1,
            "K": 21,
            "BB": 7,
            "WAR": 0.5
        }
    ]

    const loadSampleData = `
insert into PitchingStats (PtCardID,StatsBatchID,G,GS,IP,K,BB,WAR)
values
(1,1,5,5,10.2,10,2,0.5),
(1,1,11,10,30.1,3,2,1.4),
(1,1,20,0,17,15,6,-0.2),
(2,1,5,0,4.2,3,2,2.7),
(2,1,17,17,56.2,18,5,-0.2);`

    const db = new Database("E:\\ootp_data\\sqlite\\test.db");
    await db.execute(loadSampleData);

    const pitchingStatsScript = getTournamentPitchingStats(1);
    const pitchingStats = await db.prep(pitchingStatsScript);

    const card1Stats = pitchingStats.find((stats) => stats.PtCardID === 1);
    const card2Stats = pitchingStats.find((stats) => stats.PtCardID === 2);
    
    expect(databaseObjectEqual(card1Stats,desiredData.find((data) => data.PtCardID === 1))).toBeTruthy();
    expect(databaseObjectEqual(card2Stats,desiredData.find((data) => data.PtCardID === 2))).toBeTruthy();

})