import { test, expect, beforeAll, afterAll } from '@jest/globals'
import * as fs from 'node:fs'
import * as path from 'node:path';
import { initializeDatabase } from './util';
import { ProjectJsonModelReader } from '../src/backend/database-creator';
import { BattingStatsExpanded, DatatableModel } from '../src/backend/types';
import { DataInserter } from '../src/backend/database/DataInserter';

import { BattingStats, LiveUpdate, PtCard, StatsBatch, TournamentType } from '../src/backend/database/databaseTypes';
import { BattingStatsFilter, IBattingStatsGetter, LocalSqliteBattingStatsGetter } from '../src/backend/stats-reading'

const databaseFilePath = ['E:','ootp_data','sqlite','test','load-tournament-stats']

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

test('Read tourney stats for 1 player', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    const datatableModels = await datatableModelReader.getJsonModels();

    const liveUpdates: LiveUpdate[] = [
        {
            LiveUpdateID: 1,
            EffectiveDate: '2026-01-01'
        }
    ]
    const ptCards: PtCard[] = [
        {
            CardID: 1,
            CardTitle: 'Bryce Harper',
            CardType: 1,
            LiveUpdateID: 1,
            PtCardID: 1,
            CardValue: 100,
            Position: 3,
        }
    ]
    const tournamentTypes: TournamentType[] = [
        {
            TournamentTypeID: 1
        }
    ]
    const statsBatches: StatsBatch[] = [
        {
            StatsBatchID: 1,
            TournamentTypeID: 1,
        },
        {
            StatsBatchID: 2,
            TournamentTypeID: 1,
        }
    ]
    const battingStats: BattingStats[] = [
        {
            BattingStatsID: 1,
            TeamName: 'Test',
            PtCardID: 1,
            StatsBatchID: 1,
            G: 5,
            H: 4,
            PA: 10,
            AB: 10,
        },
        {
            BattingStatsID: 2,
            TeamName: 'OtherTeam',
            PtCardID: 1,
            StatsBatchID: 2,
            G: 2,
            H: 3,
            PA: 17,
            AB: 17,
        },        
        {
            BattingStatsID: 3,
            TeamName: 'Test',
            PtCardID: 1,
            StatsBatchID: 2,
            G: 5,
            H: 6,
            PA: 8,
            AB: 8,
        }
    ]
    
    const dataInserter = new DataInserter(db, datatableModels);
    await dataInserter.insertRawDataAsync(liveUpdates, "LiveUpdate");    
    await dataInserter.insertRawDataAsync(ptCards, "PtCard");
    await dataInserter.insertRawDataAsync(tournamentTypes, "TournamentType"); 
    await dataInserter.insertRawDataAsync(statsBatches, "StatsBatch"); 
    await dataInserter.insertRawDataAsync(battingStats, "BattingStats"); 

    const battingStatsFilter: BattingStatsFilter = {
        TournamentTypeID: 1,
        Positions: 'ANY'        
    }
    
    const battingStatsReader: IBattingStatsGetter = new LocalSqliteBattingStatsGetter (db)
    const tournamentBattingStats = await battingStatsReader.getTournamentStatsAsync(battingStatsFilter);

    const stats: BattingStatsExpanded = tournamentBattingStats.find(b => b.PtCardID === 1)!;
    expect(stats['G'] === 12).toBeTruthy();
    expect(stats['H'] === 13).toBeTruthy();
    expect(stats['PA'] === 35).toBeTruthy();
    expect(stats['AB'] === 35).toBeTruthy();

});

test('Read tourney stats for 1 player when there are 2 live updates', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    const datatableModels = await datatableModelReader.getJsonModels();

    const liveUpdates: LiveUpdate[] = [
        {
            LiveUpdateID: 1,
            EffectiveDate: '2026-01-01'
        },
        {
            LiveUpdateID: 2,
            EffectiveDate: '2026-06-01'
        }
    ]
    const ptCards: PtCard[] = [
        {
            CardID: 1,
            CardTitle: 'Bryce Harper',
            CardType: 1,
            LiveUpdateID: 1,
            PtCardID: 1,
            CardValue: 100,
            Position: 3,
        },
        {
            CardID: 1,
            CardTitle: 'Bryce Harper',
            CardType: 1,
            LiveUpdateID: 2,
            PtCardID: 2,
            CardValue: 95,
            Position: 3,
        }
    ]
    const tournamentTypes: TournamentType[] = [
        {
            TournamentTypeID: 1
        }
    ]
    const statsBatches: StatsBatch[] = [
        {
            StatsBatchID: 1,
            TournamentTypeID: 1,
            TournamentStartDate: '2026-01-10',
        },
        {
            StatsBatchID: 2,
            TournamentTypeID: 1,
            TournamentStartDate: '2026-06-10',
        },        
        {
            StatsBatchID: 3,
            TournamentTypeID: 1,
            TournamentStartDate: '2026-06-11',
        }
    ]
    const battingStats: BattingStats[] = [
        {
            BattingStatsID: 1,
            TeamName: 'Test',
            PtCardID: 1,
            StatsBatchID: 1,
            G: 5,
            H: 4,
            PA: 10,
            AB: 10,
        },
        {
            BattingStatsID: 2,
            TeamName: 'OtherTeam',
            PtCardID: 2,
            StatsBatchID: 2,
            G: 2,
            H: 3,
            PA: 17,
            AB: 17,
        },        
        {
            BattingStatsID: 3,
            TeamName: 'Test',
            PtCardID: 2,
            StatsBatchID: 3,
            G: 5,
            H: 6,
            PA: 8,
            AB: 8,
        }
    ]

    const dataInserter = new DataInserter(db, datatableModels);
    await dataInserter.insertRawDataAsync(liveUpdates, "LiveUpdate");    
    await dataInserter.insertRawDataAsync(ptCards, "PtCard");
    await dataInserter.insertRawDataAsync(tournamentTypes, "TournamentType"); 
    await dataInserter.insertRawDataAsync(statsBatches, "StatsBatch"); 
    await dataInserter.insertRawDataAsync(battingStats, "BattingStats"); 


    const battingStatsFilter: BattingStatsFilter = {
        TournamentTypeID: 1,
        Positions: 'ANY',
        TournamentTimeRange: {
            StartDate: "2026-06-01",
            EndDate: "2026-06-30",
        }        
    }
    
    const battingStatsReader: IBattingStatsGetter = new LocalSqliteBattingStatsGetter (db)
    const tournamentBattingStats = await battingStatsReader.getTournamentStatsAsync(battingStatsFilter);

    expect(tournamentBattingStats.length === 1).toBeTruthy();
    const stats: BattingStatsExpanded = tournamentBattingStats.find(b => b.PtCardID === 2)!;
    expect(stats['G'] === 7).toBeTruthy();
    expect(stats['H'] === 9).toBeTruthy();
    expect(stats['PA'] === 25).toBeTruthy();
    expect(stats['AB'] === 25).toBeTruthy();

});