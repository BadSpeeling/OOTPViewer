import { test, expect } from '@jest/globals'
import { checkErrorMessage } from './util'
import { OotpExportDataColumn } from '../src/backend/types'
import { IOotpExportReader, PtCardListValue, OotpCsvExportReader } from '../src/backend/card-loading/'

test('Read a card out of the data file', async () => {

    const expectedHeaders: OotpExportDataColumn[] = [
        {
            databaseColumnName: "ExampleString",
            nameInSource: "ExampleString",
            type: "TEXT",
        },
        {
            databaseColumnName: "ExampleNumber",
            nameInSource: "ExampleNumber",
            type: "INTEGER",
        }
    ]

    const dataReader: IOotpExportReader = new OotpCsvExportReader(expectedHeaders, [".","test","data","simple_pt_card_list.csv"]);
    const ptCards = await dataReader.readExport();

    expect(ptCards.length === 1).toBeTruthy();

    const readCard = ptCards[0];
    validateColumnValue(readCard[0], 'Test String');
    validateColumnValue(readCard[1], '125');

})

test('Multiple row test with 1 column being empty', async () => {

    const expectedHeaders: OotpExportDataColumn[] = [
        {
            databaseColumnName: "ExampleString",
            nameInSource: "ExampleString",
            type: "TEXT",
        },
        {
            databaseColumnName: "ExampleNumberNullable",
            nameInSource: "ExampleNumberNullable",
            type: "INTEGER",
        },
        {
            databaseColumnName: "ExampleColumn",
            nameInSource: "ExampleColumn",
            type: "INTEGER",
        },        
    ]

    const dataReader: IOotpExportReader = new OotpCsvExportReader(expectedHeaders, [".","test","data","multi_row_pt_card_list.csv"]);
    const ptCards = await dataReader.readExport();

    expect(ptCards.length === 3).toBeTruthy();

    const ptCardWithEmptyCol = ptCards[1];
    validateColumnValue(ptCardWithEmptyCol[1], '');

})

test('Test read errors', async () => {

    const callDataReader = async (columns: OotpExportDataColumn[], expectedError: string) => {
        try {
            const dataReader: IOotpExportReader = new OotpCsvExportReader(columns, [".","test","data","multi_row_pt_card_list.csv"]);
            await dataReader.readExport();
            return false;
        }
        catch (err) {
            return checkErrorMessage(err, expectedError);
        }
    }

    const incorrectAmountColumns: OotpExportDataColumn[] = [
        {
            databaseColumnName: "ExampleString",
            nameInSource: "ExampleString",
            type: "TEXT",
        },
        {
            databaseColumnName: "ExampleNumberNullable",
            nameInSource: "ExampleNumberNullable",
            type: "INTEGER",
        },        
    ]

    const incorrectColumnCountErrorOccuredFlag = await callDataReader(incorrectAmountColumns, "The expected input and actual input do not have the same amount of columns");
    expect(incorrectColumnCountErrorOccuredFlag).toBeTruthy();

    const incorrectNameColumns: OotpExportDataColumn[] = [
        {
            databaseColumnName: "ExampleString",
            nameInSource: "ExampleString",
            type: "TEXT",
        },
        {
            databaseColumnName: "ExampleNumberNullable",
            nameInSource: "ExampleNumberNullable_INCORRECT",
            type: "INTEGER",
        },
        {
            databaseColumnName: "ExampleColumn",
            nameInSource: "ExampleColumn",
            type: "INTEGER",
        },        
    ]

    const incorrectColumnNameErrorOccuredFlag = await callDataReader(incorrectNameColumns, "is not the expected column name in place");
    expect(incorrectColumnNameErrorOccuredFlag).toBeTruthy();

})

const validateColumnValue = (entry: PtCardListValue | undefined, value: string) => {
    expect(entry?.fieldValue === value).toBeTruthy();
}

// test('LiveUpdate CRUD', async () => {

//     const databasePath = dir + "test.db";
//     const database = new Database(databasePath);

//     const liveUpdateID = await upsertLiveUpdate(database, {LiveUpdateID: null, EffectiveDate: '2025-04-01'});
//     const liveUpdates1 = await getLiveUpdates(databasePath);
    
//     expect(liveUpdates1.find((liveUpdate) => liveUpdate.LiveUpdateID === liveUpdateID)?.EffectiveDate).toBe('2025-04-01');

//     await upsertLiveUpdate(database, {LiveUpdateID: liveUpdateID, EffectiveDate: '2025-04-15'});
//     const liveUpdates2 = await getLiveUpdates(databasePath);

//     expect(liveUpdates2.find((liveUpdate) => liveUpdate.LiveUpdateID === liveUpdateID)?.EffectiveDate).toBe('2025-04-15');

// })

// test('Populate PtCard table with record', async () => {

//     const liveCard = readPtCardsTest.populatePtCardTableTest.historicalCard;
//     const expectedLiveCard = readPtCardsTest.populatePtCardTableTest.historicalCardExpectedData

//     const database = new Database(dir + "test.db");
//     await writeCards(database, [liveCard]);

//     const liveCardRecord = await database.get(`select * from PtCard where CardID = ${expectedLiveCard.CardID}`)
    
//     expect(databaseObjectEqual(liveCardRecord,expectedLiveCard)).toBeTruthy();

// })

// test('Populate PtCards table with updated live cards', async () => {

//     const liveCardVersion1 = readPtCardsTest.populatePtCardLiveUpdateTest.liveCardVersion1;
//     const liveCardVersion2 = readPtCardsTest.populatePtCardLiveUpdateTest.liveCardVersion2;

//     const database = new Database(dir + "test.db");

//     await writeCards(database, [liveCardVersion1]);
//     const newLiveUpdateID = await database.insertOne("insert into LiveUpdate (EffectiveDate) values (UNIXEPOCH('2025-05-01'))");
//     await writeCards(database, [liveCardVersion2]);

//     const liveCards = await database.getAll(`select CardID,CardTitle,CardValue,LiveUpdateID from PtCard where CardID = ${liveCardVersion1["Card ID"]} order by LiveUpdateID asc`)

//     expect(liveCards.length).toBe(2);
//     expect(liveCards[0].LiveUpdateID !== newLiveUpdateID);
//     expect(liveCards[1].LiveUpdateID === newLiveUpdateID)

// })

// test('Detect a live update has happened for live cards', async () => {
    
//     const liveUpdateCardVersion1 = readPtCardsTest.checkLiveUpdateOccuredTest.liveCardVersion1;
//     const liveUpdateCardVersion2 = readPtCardsTest.checkLiveUpdateOccuredTest.liveCardVersion2;

//     const database = new Database(dir + "test.db");
//     await writeCards(database, [liveUpdateCardVersion1]);

//     const checkIfLiveUpdateOccuredResult = await checkIfLiveUpdateOccured(database, [liveUpdateCardVersion2]);
//     expect(checkIfLiveUpdateOccuredResult).toBeTruthy();

//     const checkIfLiveUpdateOccuredResultFalse = await checkIfLiveUpdateOccured(database, [liveUpdateCardVersion1]);
//     expect(checkIfLiveUpdateOccuredResultFalse).toBeFalsy();

// })