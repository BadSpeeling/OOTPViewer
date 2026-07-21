import * as fs from 'fs';

import { Database } from "./database/Database"
import { getLiveUpdatesScript, insertLiveUpdateScript, updateLiveUpdateScript } from './database/sqliteScripts'

import { OotpExportDataColumn,CsvRecord,PtCard,LiveUpdate } from "./types"
import { ProcessCardsStatus } from "../types"

import { ProjectJsonModelReader } from './database-creator';
import { OotpCsvExportReader } from './card-loading/export-reader'

import { PtCardListExportScriptGenerator } from './card-loading/export-stats'

export async function processPtCardList (ptCardListFilePath: string[], database: Database, bypassLiveUpdateOccuredCheck: boolean = false) {

    const ptCardListModelReader = new ProjectJsonModelReader<OotpExportDataColumn>("ptCardListColumns.json")
    const ptCardListModel = await ptCardListModelReader.getJsonModels();

    const cards = await getCards(ptCardListFilePath, ptCardListModel);

    const ptCardListScriptGenerator = new PtCardListExportScriptGenerator(cards);
    const liveUpdateOccuredFlag = !bypassLiveUpdateOccuredCheck ? await checkIfLiveUpdateOccured(database, ptCardListScriptGenerator) : false;

    if (!liveUpdateOccuredFlag) {
        try {
            const ptCardListExportScript = ptCardListScriptGenerator.getImportScript();
            await database.execute(ptCardListExportScript);
        }
        catch (err) {
            console.log(err)
        }
        return ProcessCardsStatus.Success
    }
    else {
        return ProcessCardsStatus.LiveUpdateNeeded
    }

}

export async function getCards (ptCardListFilePath: string[], ptCardListModel: OotpExportDataColumn[]) {

    const ptCardListReader = new OotpCsvExportReader(ptCardListModel, ptCardListFilePath);
    return await ptCardListReader.readExport();

}


export function readPtCardList (file, columns: OotpExportDataColumn[]) : Promise<CsvRecord[]> {

    return new Promise ((resolve,reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {

            if (!err) {
                let lines = data.split('\r\n');
                
                //let sourceHeaders: string[] = removeTrailingComma(lines[0]).replace('//','').split(',');
                let sourceHeaders: string[] = lines[0].replace('//','').split(',');

                if (sourceHeaders.length === columns.length) {

                    for (let headerIndex = 0; headerIndex < sourceHeaders.length; headerIndex++) {
                        if (sourceHeaders[headerIndex] !== columns[headerIndex].nameInSource) {
                            reject({reason:`${sourceHeaders[headerIndex]} is not the expected column name in place ${headerIndex}`})
                        }
                    }

                    const parsedData: CsvRecord[] = [];

                    const parseCardDataValue = (curColumn: OotpExportDataColumn, value: string) => {
                        switch (curColumn.type) {
                            case "INTEGER":
                                return parseInt(value ? value : "0");
                            case "REAL":
                                return parseFloat(value? value : "0");
                            case "DATETIME":
                            case "TEXT":
                            default:                                
                                return value;
                        }
                    }

                    //start on index 1, index 0 is headers
                    for (let index = 1; index < lines.length; index++) {

                        //make sure the line isn't empty
                        if (lines[index] !== '') {

                            const curRow: CsvRecord = {};

                            const curCardDataValues = removeTrailingComma(lines[index]).split(',');
                            curCardDataValues.map((curCardDataValue, columnIndex) => {

                                const curColumn = columns[columnIndex];
                                curRow[curColumn.nameInSource] = parseCardDataValue(curColumn,curCardDataValue);

                            });

                            parsedData.push(curRow);
                            
                        }

                    }
                    
                    resolve(parsedData);

                }
                else {
                    reject({"reason":"The expected input and actual input do not have the same amount of columns"});
                }

            }

        })
    })
}

const removeTrailingComma = (line: string) => {
    return line.substring(0,line.length-1)
}

export const getPtCards = async (db: Database, columns: string[], whereClause: string | null) => {

    const getCardsScript = 
`
SELECT ${columns.join(',')}
FROM PtCard
${whereClause ?? ""}
ORDER BY PtCardID asc
`;

    return await db.getAllMapped<PtCard>(getCardsScript);

}

export const getLiveUpdates = async (databasePath: string[]) => {
    const db = new Database(databasePath);
    return await db.getAllMapped<LiveUpdate>(getLiveUpdatesScript());
}

export const upsertLiveUpdate = async (database: Database, liveUpdate: LiveUpdate) => {
    
    if (liveUpdate.LiveUpdateID) {
        const updateScript = updateLiveUpdateScript(liveUpdate);
        await database.execute(updateScript);
        return liveUpdate.LiveUpdateID;    
    }
    else {
        const insertScript = insertLiveUpdateScript(liveUpdate);
        const liveUpdateID = await database.insertOne(insertScript);
        return liveUpdateID;
    }
    
}

export const checkIfLiveUpdateOccured = async (database: Database, cards: PtCardListExportScriptGenerator) => {

    const script  = cards.getCheckLiveUpdateScript();
    const cardsInLiveUpdate = await database.getAllMapped<{LiveUpdateOccured: boolean, CardID: number}>(script);
    return typeof cardsInLiveUpdate.find(card => card.LiveUpdateOccured) !== 'undefined'

}