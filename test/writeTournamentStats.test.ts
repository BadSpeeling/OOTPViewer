import { databasePath } from "../settings.json"
import { Database } from "../src/backend/database/Database"
import { databaseObjectEqual } from "../src/utilities"
import * as path from "node:path"
import * as fs from "node:fs"

import { tournamentBattingStatsWriteScript } from "../src/backend/database/sqliteScripts"
import { convertHtmlFileToTournamentOutput } from "../src/backend/readHtmlStatsExport"
import { statsExport } from '../json/csvColumns.json'

beforeAll(async () => {
    
    const path = ".\\test\\test.db";
    fs.closeSync(fs.openSync(path, 'w'));
    
    const db = new Database(path);
    await db.createTables();
    await db.execute("INSERT INTO LiveUpdate VALUES (1,1711411200);");

});

test('tests that jest with typescript works', () => {
    expect([1,2,3].reduce((acc, curr) => acc + curr, 0)).toBe(6);
})

test('Populate PtCards table with record', async () => {

    const data = await convertHtmlFileToTournamentOutput({
        path: "D:\\OOTP Perfect Team\\js-ootpviewer\\test\\data",
        fileName: "tournament_data_2_rows.html",
    })

    const script = await tournamentBattingStatsWriteScript(data.stats,1);

    console.log(script);

})