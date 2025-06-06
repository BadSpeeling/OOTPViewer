import { databasePath } from "../settings.json"
import { Database } from "../src/backend/database/Database"
import { databaseObjectEqual } from "../src/utilities"
import * as path from "node:path"
import * as fs from "node:fs"

import { getTournamentStats, getRecentTournamentsHandler } from "../src/backend/readTournamentStats"
import { TournamentStatsQuery } from "../src/types"

const dir = "E:\\ootp_data\\sqlite\\"

beforeAll(async () => {
    fs.copyFileSync(dir +'pt.db',dir + 'test.db');

    const db = new Database(dir + "test.db");
    await db.execute('insert into StatsBatch (Timestamp,Description,TournamentTypeID) values (unixepoch(),"",1);');

});
  
afterAll(() => {
    fs.unlink(dir + 'test.db', () => {});
});

test("Load Batting stats for a tournament", async () => {

    const desiredData = [
        {
            "PtCardID": 1,
            "Bats":3,
            "Throws":1,
            "Position":6,
            "G": 49,
            "TB": 107,
            "AB": 200,
            "PA": 203,
            "H": 80,
            '1B': 71,
            "HR": 9,
            "RBI": 29,
            "SB": 13,
            "WAR": 3.9,
            "AVG": .400,
            "OBP": .409,
            "SLG": .535,
            "OPS": .944,
            "ISO": .135,
        },
        {
            "PtCardID": 2,
            "Bats":1,
            "Throws":1,
            "Position":4,
            "TB": 33,
            "G": 29,
            "AB": 61,
            "PA": 63,
            "H": 18,
            '1B': 13,
            "HR": 5,
            "RBI": 29,
            "SB": 8,
            "WAR": 0.5,
            "AVG": .295,
            "OBP": .317,
            "SLG": .541,
            "OPS": .858,
            "ISO": .246,
        }
    ]


    const db = new Database(dir + "test.db");
    const statsBatch = await db.insertOne(`insert into StatsBatch (Timestamp,Description,TournamentTypeID) values (unixepoch(),"",1);`);

    const loadSampleData = `
    insert into BattingStats (PtCardID,TeamName,StatsBatchID,G,AB,PA,[1B],H,HR,RBI,SB,WAR,TB,BB,IBB,SF)
    values
    (1,'Team1',${statsBatch},5,64,65,34,39,5,10,4,0.5,71,1,0,0),
    (1,'Team2',${statsBatch},10,33,34,15,18,3,6,1,1.5,0,1,0,0),
    (1,'Team3',${statsBatch},34,103,104,22,23,1,13,8,1.9,36,1,0,0),
    (2,'Team4',${statsBatch},12,24,25,2,5,3,11,6,0.7,33,1,0,0),
    (2,'Team5',${statsBatch},17,37,38,11,13,2,18,2,-0.2,0,1,0,0);`

    await db.execute(loadSampleData);

    const query = {
        tournamentTypeID: 1,
        statsType: 0,
        qualifierValue: 0,
        positions: [],
    } as TournamentStatsQuery

    const battingStats = await getTournamentStats(dir + "test.db",query);

    const card1Stats = battingStats.find((stats) => stats.PtCardID === 1);
    const card2Stats = battingStats.find((stats) => stats.PtCardID === 2);
    
    expect(card1Stats).toBeTruthy();
    expect(card2Stats).toBeTruthy();

    expect(databaseObjectEqual(card1Stats,desiredData.find((data) => data.PtCardID === 1))).toBeTruthy();
    expect(databaseObjectEqual(card2Stats,desiredData.find((data) => data.PtCardID === 2))).toBeTruthy();

})

test("Load Batting stats for league play", async () => {

    const desiredData = [
        {
            "LeagueYear": 2027,
            "PtCardID": 1,
            "Bats":3,
            "Throws":1,
            "Position":6,
            "G": 15,
            "TB": 81,
            "AB": 97,
            "PA": 99,
            "H": 57,
            '1B': 49,
            "HR": 8,
            "RBI": 16,
            "SB": 5,
            "WAR": 2.0
        },
        {
            "LeagueYear": 2027,
            "PtCardID": 2,
            "Bats":1,
            "Throws":1,
            "Position":4,
            "TB": 33,
            "G": 29,
            "AB": 61,
            "PA": 63,
            "H": 18,
            '1B': 13,
            "HR": 5,
            "RBI": 29,
            "SB": 8,
            "WAR": 0.5
        },
        {
            "LeagueYear": 2028,
            "PtCardID": 1,
            "Bats":3,
            "Throws":1,
            "Position":6,
            "G": 34,
            "TB": 36,
            "AB": 103,
            "PA": 104,
            "H": 23,
            '1B': 22,
            "HR": 1,
            "RBI": 13,
            "SB": 8,
            "WAR": 1.9
        }
    ]

    const db = new Database(dir + "test.db");
    const statsBatch = await db.insertOne(`insert into StatsBatch (Timestamp,Description,TournamentTypeID) values (unixepoch(),'{"Year":2027,"Level":"High Bronze","Team":"Lil Dickey"}',2);`);

    const loadSampleData = `
    insert into BattingStats (PtCardID,TeamName,StatsBatchID,G,AB,PA,[1B],H,HR,RBI,SB,WAR,TB,BB,IBB,SF)
    values
    (1,'Team1',${statsBatch},5,64,65,34,39,5,10,4,0.5,54,1,0,0),
    (1,'Team2',${statsBatch},10,33,34,15,18,3,6,1,1.5,27,1,0,0),
    (2,'Team4',${statsBatch},12,24,25,2,5,3,11,6,0.7,33,1,0,0),
    (2,'Team5',${statsBatch},17,37,38,11,13,2,18,2,-0.2,0,1,0,0);`

    const statsBatch1 = await db.insertOne(`insert into StatsBatch (Timestamp,Description,TournamentTypeID) values (unixepoch(),'{"Year":2028,"Level":"High Bronze","Team":"Lil Dickey"}',2);`);
    await db.execute(loadSampleData);

    const loadSampleData1 = `
    insert into BattingStats (PtCardID,TeamName,StatsBatchID,G,AB,PA,[1B],H,HR,RBI,SB,WAR,TB,BB,IBB,SF)
    values
    (1,'Team3',${statsBatch1},34,103,104,22,23,1,13,8,1.9,36,1,0,0);`

    await db.execute(loadSampleData1);

    const query = {
        tournamentTypeID: 2,
        statsType: 0,
        qualifierValue: 0,
        positions: [],
        years: [2027,2028],
    } as TournamentStatsQuery

    const battingStats = await getTournamentStats(dir + "test.db", query);

    const season1Card1 = battingStats.find((stats) => stats.PtCardID === 1 && stats.LeagueYear === 2027);
    const season1Card2 = battingStats.find((stats) => stats.PtCardID === 2 && stats.LeagueYear === 2027);
    const season2Card2 = battingStats.find((stats) => stats.PtCardID === 1 && stats.LeagueYear === 2028);

    expect(season1Card1).toBeTruthy();
    expect(season1Card2).toBeTruthy();
    expect(season2Card2).toBeTruthy();

    expect(databaseObjectEqual(season1Card1,desiredData.find((data) => data.PtCardID === 1 && data.LeagueYear === 2027))).toBeTruthy();
    expect(databaseObjectEqual(season1Card2,desiredData.find((data) => data.PtCardID === 2 && data.LeagueYear === 2027))).toBeTruthy();
    expect(databaseObjectEqual(season2Card2,desiredData.find((data) => data.PtCardID === 1 && data.LeagueYear === 2028))).toBeTruthy();

})

test("Load Pitching stats for a tournament", async () => {

    const desiredData = [
        {
            "PtCardID": 1,
            "Bats":3,
            "Throws":1,
            "Position":6,
            "G": 36,
            "GS": 15,
            "IP": 58,
            "K": 28,
            "BB": 10,
            "WAR": 1.7
        },
        {
            "PtCardID": 2,
            "Bats":1,
            "Throws":1,
            "Position":4,
            "G": 22,
            "GS": 17,
            "IP": 61.1,
            "K": 21,
            "BB": 7,
            "WAR": 2.7
        }
    ]

    const db = new Database(dir + "test.db");
    const statsBatch = await db.insertOne(`insert into StatsBatch (Timestamp,Description,TournamentTypeID) values (unixepoch(),"",1);`);

    const loadSampleData = `
insert into PitchingStats (PtCardID,TeamName,StatsBatchID,G,GS,IP,K,BB,WAR)
values
(1,'Team1',${statsBatch},5,5,10.2,10,2,0.5),
(1,'Team2',${statsBatch},11,10,30.1,3,2,1.4),
(1,'Team3',${statsBatch},20,0,17,15,6,-0.2),
(2,'Team4',${statsBatch},5,0,4.2,3,2,2.9),
(2,'Team5',${statsBatch},17,17,56.2,18,5,-0.2);`

    await db.execute(loadSampleData);

    const query = {
        tournamentTypeID: 1,
        statsType: 1,
        qualifierValue: 0,
        positions: [],
    } as TournamentStatsQuery

    const pitchingStats = await getTournamentStats(dir + "test.db",query);

    const card1Stats = pitchingStats.find((stats) => stats.PtCardID === 1);
    const card2Stats = pitchingStats.find((stats) => stats.PtCardID === 2);
    
    expect(card1Stats).toBeTruthy();
    expect(card2Stats).toBeTruthy();

    expect(databaseObjectEqual(card1Stats,desiredData.find((data) => data.PtCardID === 1))).toBeTruthy();
    expect(databaseObjectEqual(card2Stats,desiredData.find((data) => data.PtCardID === 2))).toBeTruthy();

})

test("Load Pitching stats for league play", async () => {

    const desiredData = [
        {
            "LeagueYear": 2027,
            "PtCardID": 1,
            "Bats":3,
            "Throws":1,
            "Position":6,
            "G": 13,
            "ER": 32,
        },
        {
            "LeagueYear": 2027,
            "PtCardID": 2,
            "Bats":1,
            "Throws":1,
            "Position":4,
            "G": 14,
            "ER": 25,
        },
        {
            "LeagueYear": 2028,
            "PtCardID": 1,
            "Bats":3,
            "Throws":1,
            "Position":6,
            "G": 8,
            "ER": 3,
        },
    ]


    const db = new Database(dir + "test.db");
    const statsBatch = await db.insertOne(`insert into StatsBatch (Timestamp,Description,TournamentTypeID) values (unixepoch(),'{"Year":2027,"Level":"High Bronze","Team":"Lil Dickey"}',2);`);

    const loadSampleData = `
    insert into PitchingStats (PtCardID,TeamName,StatsBatchID,G,ER)
    values
    (1,'Team1',${statsBatch},5,7),
    (1,'Team2',${statsBatch},8,25),
    (2,'Team4',${statsBatch},10,22),
    (2,'Team5',${statsBatch},4,3);`

    const statsBatch1 = await db.insertOne(`insert into StatsBatch (Timestamp,Description,TournamentTypeID) values (unixepoch(),'{"Year":2028,"Level":"High Bronze","Team":"Lil Dickey"}',2);`);
    await db.execute(loadSampleData);

    const loadSampleData1 = `
    insert into PitchingStats (PtCardID,TeamName,StatsBatchID,G,ER)
    values
    (1,'Team3',${statsBatch1},8,3);`

    await db.execute(loadSampleData1);

    const query = {
        tournamentTypeID: 2,
        statsType: 1,
        qualifierValue: 0,
        positions: [],
        years: [2027,2028],
    } as TournamentStatsQuery

    const pitchingStats = await getTournamentStats(dir + "test.db",query);

    const season1Card1 = pitchingStats.find((stats) => stats.PtCardID === 1 && stats.LeagueYear === 2027);
    const season1Card2 = pitchingStats.find((stats) => stats.PtCardID === 2 && stats.LeagueYear === 2027);
    const season2Card1 = pitchingStats.find((stats) => stats.PtCardID === 1 && stats.LeagueYear === 2028);

    expect(season1Card1).toBeTruthy();
    expect(season1Card2).toBeTruthy();
    expect(season2Card1).toBeTruthy();

    expect(databaseObjectEqual(season1Card1,desiredData.find((data) => data.PtCardID === 1 && data.LeagueYear === 2027))).toBeTruthy();
    expect(databaseObjectEqual(season1Card2,desiredData.find((data) => data.PtCardID === 2 && data.LeagueYear === 2027))).toBeTruthy();
    expect(databaseObjectEqual(season2Card1,desiredData.find((data) => data.PtCardID === 1 && data.LeagueYear === 2028))).toBeTruthy();

})

test("Get recent tourmanents test", async () => {

    const desiredData = {
        'Import Date': '2025-03-14',
        'W': 13,
        'L': 7,
        'Tournament Name': 'Test'
    }

    const db = new Database(dir + "test.db");
    const statsBatch = await db.insertOne(`insert into StatsBatch (Timestamp,Description,TournamentTypeID) values (unixepoch('2025-03-14'),"",1);`);

    const loadSampleData = `
insert into PitchingStats (PtCardID,TeamName,StatsBatchID,G,W,L)
values
(1,'Team1',${statsBatch},0,5,3),
(2,'Team1',${statsBatch},0,0,2),
(3,'Team1',${statsBatch},0,8,2)
`

    await db.execute(loadSampleData);

    const limit = 1;
    const recentTournaments = await getRecentTournamentsHandler(dir + "test.db", 'Team1', limit);
    
    expect(limit === recentTournaments.length).toBeTruthy();
    databaseObjectEqual(recentTournaments[0], desiredData);
    
})

test("Get tournaments from timeframe", async () => {


    const db = new Database(dir + "test.db");
    const statsBatch1 = await db.insertOne(`insert into StatsBatch (Timestamp,Description,TournamentStartDate,TournamentTypeID) values (unixepoch(),"","2025-05-06",1);`);
    const statsBatch2 = await db.insertOne(`insert into StatsBatch (Timestamp,Description,TournamentStartDate,TournamentTypeID) values (unixepoch(),"","2025-05-07",1);`);

    await db.insertOne(`insert into BattingStats (StatsBatchID,TeamName,PtCardID,G,AB,PA) values (${statsBatch1},'Team1',1,10,5,5),(${statsBatch2},'Team2',2,10,5,5);`);
    await db.insertOne(`insert into PitchingStats (StatsBatchID,TeamName,PtCardID,G) values (${statsBatch1},'Team1',1,10),(${statsBatch2},'Team2',2,10);`);

    const battingQuery = {
        tournamentTypeID: 1,
        statsType: 0,
        qualifierValue: 0,
        positions: [],
        tourneyTimeframe: {
            startDate: '2025-05-07',
            endDate: '2025-05-07',
        }
    } as TournamentStatsQuery

    const pitchingQuery = {
        tournamentTypeID: 1,
        statsType: 1,
        qualifierValue: 0,
        positions: [],
        tourneyTimeframe: {
            startDate: '2025-05-07',
            endDate: '2025-05-07',
        }
    } as TournamentStatsQuery

    const battingStats = await getTournamentStats(dir + "test.db",battingQuery);
    const pitchingStats = await getTournamentStats(dir + "test.db", pitchingQuery);

    const battingStatsPastTourney = battingStats.find(b => b.PtCardID === 1);
    const battingStatsCurrentTourney = battingStats.find(b => b.PtCardID === 2);

    const pitchingStatsPastTourney = pitchingStats.find(b => b.PtCardID === 1);
    const pitchingStatsCurrentTourney = pitchingStats.find(b => b.PtCardID === 2);

    expect(battingStatsPastTourney).toBeFalsy();
    expect(battingStatsCurrentTourney).toBeTruthy();

    expect(pitchingStatsPastTourney).toBeFalsy();
    expect(pitchingStatsCurrentTourney).toBeTruthy();

})