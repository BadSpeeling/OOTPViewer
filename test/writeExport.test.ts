import { test, expect, beforeAll, afterAll } from '@jest/globals'
import * as fs from 'node:fs'
import * as path from 'node:path';

import { ProjectJsonModelReader } from '../src/backend/database-creator'
import { DatatableModel, OotpExportDataColumn } from '../src/backend/types';

import { PtCardImporter } from '../src/backend/PtCardImporter';
import { getStats, writeStats } from '../src/backend/readHtmlStatsExport'

import { initializeDatabase } from './util'
import { simpleCardInsert } from './scripts/ptcard-inserts'
import { FakeOneCardLiveUpdateReader } from './fakes/OotpExportReader/FakeOneCardLiveUpdateReader';
import { OotpCsvExportReader } from '../src/backend/card-loading/export-reader';
import { ProcessCardsStatus } from '../src/types';

const databaseFilePath = ['E:','ootp_data','sqlite','test','data-exports']

beforeAll(() => {

    const testPath = path.join(...databaseFilePath);

    //if the testing folder doesn't exist, create it
    if (!fs.existsSync(testPath)) {
        fs.mkdirSync(testPath);
    }

})

afterAll(() => {

    fs.readdir(path.join(...databaseFilePath), (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(...databaseFilePath, file), (err) => {
                if (err) throw err;
            });
        }
    });

})

test('Read and write real OOTP27 pt_card_list file', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    await db.execute("INSERT INTO LiveUpdate (LiveUpdateID,EffectiveDate) VALUES (1,'2026-01-01');")

    const ptCardListModelReader = new ProjectJsonModelReader<OotpExportDataColumn>("ptCardListColumns.json")
    const ptCardListModel = await ptCardListModelReader.getJsonModels();
    const csvReader = new OotpCsvExportReader(ptCardListModel, [process.cwd(), 'test', 'data', 'real_pt_card_list.csv']);

    const cardImporter = new PtCardImporter(db, csvReader);
    const importResult = await cardImporter.importPtCardsAsync();

    expect(importResult === ProcessCardsStatus.SUCCESS).toBeTruthy();

    const result = await db.getAll("select * from PtCard")
    expect(result.length === 9).toBeTruthy();

    const result1 = result.find(r => r.CardID === 85352);
    expect(result1).toBeTruthy();
    expect(result1!["brefid"] === 'zobribe01').toBeTruthy();
    expect(result1!["date"] === '2026-05-12').toBeTruthy();
    expect(result1!["packs"] === 1).toBeTruthy();

})

test('Do not update because live update occured', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    await db.execute("INSERT INTO LiveUpdate (LiveUpdateID,EffectiveDate) VALUES (1,'2026-01-01');")
    await db.execute(simpleCardInsert);

    const cardImporter = new PtCardImporter(db, new FakeOneCardLiveUpdateReader());
    const importResult = await cardImporter.importPtCardsAsync();

    expect(importResult === ProcessCardsStatus.LIVE_UPDATE_NEEDED).toBeTruthy();

})

test('Read and write batting and pitching stats', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    await db.execute("INSERT INTO LiveUpdate (LiveUpdateID,EffectiveDate) VALUES (1,'2026-01-01');")
    await db.execute("INSERT INTO TournamentType (TournamentTypeID, Name, CardRestriction, MaxOverall, IsQuick, IsCap, IsLive, CapAmount) VALUES (1, 'Test', 'None', 100, 0, 0, 0, 0)");
    await db.execute(simpleCardInsert);

    const stats = await getStats([process.cwd(), 'test', 'data', 'tournament-simple-example.html']);
    await writeStats(stats, db, 'test', 1);

    const battingStats = await db.getAll("SELECT * FROM BattingStats");
    expect(battingStats.length === 1).toBeTruthy();
    expect(battingStats[0].G === 3).toBeTruthy();
    expect(battingStats[0].PtCardID === 1).toBeTruthy();

    const pitchingStats = await db.getAll("SELECT * FROM PitchingStats");
    expect(pitchingStats.length === 1).toBeTruthy();
    expect(pitchingStats[0].G === 2).toBeTruthy();
    expect(pitchingStats[0].PtCardID === 2).toBeTruthy();

})