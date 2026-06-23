import { test, expect } from '@jest/globals'

import { OotpExportDataColumn } from '../src/backend/types'
import { IOotpExportReader, PtCardListValue, OotpHtmlExportReader } from '../src/backend/card-loading/'
import { checkErrorMessage } from './util'

test('Read data out of html file', async () => {

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

    const dataReader: IOotpExportReader = new OotpHtmlExportReader(expectedHeaders, [".","test","data","export-example.html"]);
    const exportResults = await dataReader.readExport();

    expect(exportResults.recordCount() === 2).toBeTruthy();

    const result1 = exportResults.getRecord(0);
    expect(result1[0].fieldValue === "Lil Dickey").toBeTruthy();
    expect(result1[1].fieldValue === "69647").toBeTruthy();

    const result2 = exportResults.getRecord(1);
    expect(result2[0].fieldValue === "Abydos").toBeTruthy();
    expect(result2[1].fieldValue === "69653").toBeTruthy();

})

test('Read data out of html file with an " " in a data cell', async () => {

    const expectedHeaders: OotpExportDataColumn[] = [
        {
            databaseColumnName: "ExampleString",
            nameInSource: "ExampleString",
            type: "TEXT",
        },
        {
            databaseColumnName: "G",
            nameInSource: "G",
            type: "INTEGER",
        },
        {
            databaseColumnName: "GS",
            nameInSource: "GS",
            type: "INTEGER",
        }
    ]

    const dataReader: IOotpExportReader = new OotpHtmlExportReader(expectedHeaders, [".","test","data","export-example-empty-cols.html"]);
    const exportResults = await dataReader.readExport();

    expect(exportResults.recordCount() === 3).toBeTruthy();

    const result1 = exportResults.getRecord(0);
    expect(result1[0].fieldValue === "Lil Dickey").toBeTruthy();
    expect(result1[1].fieldValue === "").toBeTruthy();
    expect(result1[2].fieldValue === "").toBeTruthy();

    const result2 = exportResults.getRecord(1);
    expect(result2[0].fieldValue === "Abydos").toBeTruthy();
    expect(result2[1].fieldValue === "1").toBeTruthy();
    expect(result2[2].fieldValue === "").toBeTruthy();

    const result3 = exportResults.getRecord(2);
    expect(result3[0].fieldValue === "Some name").toBeTruthy();
    expect(result3[1].fieldValue === "5").toBeTruthy();
    expect(result3[2].fieldValue === "3").toBeTruthy();

})

test('Expected columns are out of order', async () => {

    const outOfOrderHeaders: OotpExportDataColumn[] = [
        {
            databaseColumnName: "ExampleString",
            nameInSource: "ExampleString",
            type: "TEXT",
        },
        {
            databaseColumnName: "GS",
            nameInSource: "GS",
            type: "INTEGER",
        },
        {
            databaseColumnName: "G",
            nameInSource: "G",
            type: "INTEGER",
        }
    ]

    const dataReader: IOotpExportReader = new OotpHtmlExportReader(outOfOrderHeaders, [".","test","data","export-example-empty-cols.html"]);
    let correctErrorOccuredFlag = false;
    
    try {
        await dataReader.readExport();
    }
    catch (err) {
        correctErrorOccuredFlag = checkErrorMessage(err, "is not the expected column name in place");
    }

    expect(correctErrorOccuredFlag).toBeTruthy();

})

test('Read export with duplicate columns', async () => {

    const outOfOrderHeaders: OotpExportDataColumn[] = [
        {
            databaseColumnName: "ExampleString",
            nameInSource: "ExampleString",
            type: "TEXT",
        },
        {
            databaseColumnName: "G",
            nameInSource: "G",
            type: "INTEGER",
        },
        {
            databaseColumnName: "H",
            nameInSource: "H",
            type: "INTEGER",
        },
        {
            databaseColumnName: "G",
            nameInSource: "G",
            type: "INTEGER",
        },
        {
            databaseColumnName: "ER",
            nameInSource: "ER",
            type: "INTEGER",
        }
    ]

    const dataReader: IOotpExportReader = new OotpHtmlExportReader(outOfOrderHeaders, [".","test","data","export-example-duplicate-columns.html"]);
    const duplicateColumnsData = await dataReader.readExport();

    expect(duplicateColumnsData.recordCount() === 1).toBeTruthy();

    const dataRow = duplicateColumnsData.getRecord(0);

    expect(dataRow[0].fieldName === 'ExampleString').toBeTruthy();
    expect(dataRow[0].fieldValue === 'Test').toBeTruthy();

    expect(dataRow[1].fieldName === 'G').toBeTruthy();
    expect(dataRow[1].fieldValue === '10').toBeTruthy();

    expect(dataRow[2].fieldName === 'H').toBeTruthy();
    expect(dataRow[2].fieldValue === '4').toBeTruthy();

    expect(dataRow[3].fieldName === 'G').toBeTruthy();
    expect(dataRow[3].fieldValue === '15').toBeTruthy();

    expect(dataRow[4].fieldName === 'ER').toBeTruthy();
    expect(dataRow[4].fieldValue === '2').toBeTruthy();

})

test('Incorrect amount of columns provided', async () => {

    const outOfOrderHeaders: OotpExportDataColumn[] = [
        {
            databaseColumnName: "ExampleString",
            nameInSource: "ExampleString",
            type: "TEXT",
        },
        {
            databaseColumnName: "G",
            nameInSource: "G",
            type: "INTEGER",
        }
    ]

    const dataReader: IOotpExportReader = new OotpHtmlExportReader(outOfOrderHeaders, [".","test","data","export-example-empty-cols.html"]);
    let correctErrorOccuredFlag = false;
    
    try {
        await dataReader.readExport();
    }
    catch (err) {
        correctErrorOccuredFlag = checkErrorMessage(err, "The expected input and actual input do not have the same amount of columns");
    }

    expect(correctErrorOccuredFlag).toBeTruthy();

})

test('Missing data table test', async () => {

    const outOfOrderHeaders: OotpExportDataColumn[] = [
        {
            databaseColumnName: "ExampleString",
            nameInSource: "ExampleString",
            type: "TEXT",
        },
        {
            databaseColumnName: "G",
            nameInSource: "G",
            type: "INTEGER",
        }
    ]

    const dataReader: IOotpExportReader = new OotpHtmlExportReader(outOfOrderHeaders, [".","test","data","export-example-missing-table.html"]);
    let correctErrorOccuredFlag = false;
    
    try {
        await dataReader.readExport();
    }
    catch (err) {
        correctErrorOccuredFlag = checkErrorMessage(err, "Could not find export table");
    }

    expect(correctErrorOccuredFlag).toBeTruthy();

})

test('Missing headers test', async () => {

    const outOfOrderHeaders: OotpExportDataColumn[] = [
        {
            databaseColumnName: "ExampleString",
            nameInSource: "ExampleString",
            type: "TEXT",
        },
        {
            databaseColumnName: "G",
            nameInSource: "G",
            type: "INTEGER",
        }
    ]

    const dataReader: IOotpExportReader = new OotpHtmlExportReader(outOfOrderHeaders, [".","test","data","export-example-missing-header.html"]);
    let correctErrorOccuredFlag = false;
    
    try {
        await dataReader.readExport();
    }
    catch (err) {
        correctErrorOccuredFlag = checkErrorMessage(err, "Could not find headers");
    }

    expect(correctErrorOccuredFlag).toBeTruthy();

})

test('Missing data test', async () => {

    const outOfOrderHeaders: OotpExportDataColumn[] = [
        {
            databaseColumnName: "ExampleString",
            nameInSource: "ExampleString",
            type: "TEXT",
        },
        {
            databaseColumnName: "G",
            nameInSource: "G",
            type: "INTEGER",
        }
    ]

    const dataReader: IOotpExportReader = new OotpHtmlExportReader(outOfOrderHeaders, [".","test","data","export-example-missing-data.html"]);
    let correctErrorOccuredFlag = false;
    
    try {
        await dataReader.readExport();
    }
    catch (err) {
        correctErrorOccuredFlag = checkErrorMessage(err, "Could not find data");
    }

    expect(correctErrorOccuredFlag).toBeTruthy();

})