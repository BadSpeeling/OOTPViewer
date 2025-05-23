import * as fs from 'fs';
import * as path from 'node:path'

import { Database } from "./database/Database"
import { ptCardListLoadScript, getLiveUpdatesScript } from './database/sqliteScripts'

import { ptCardList } from '../../json/csvColumns.json'
import { CsvDataColumn,CsvRecord,PtCard,LiveUpdate } from "./types"

import * as settings from "../../settings.json"

//     const script = await ptCardListLoadScript([liveCard,historicalCard],ptCardList);
//     const database = new Database(".\\test\\test.db");

//     await database.execute(script);
//     const liveCardRecord = await database.get(`select CardID,CardTitle,CardValue from Card where CardID = 64889`)
//     const historicalCardRecord = await database.get(`select CardID,CardTitle,CardValue from Card where CardID = 65911`)
    

export async function processPtCardList () {

    const ptCardFilePath = [...settings.ootpRoot, ...settings.ptCardFile];
    const cards = await getCards(path.join(...ptCardFilePath));
    writeCards(path.join(...settings.databasePath), cards);

}

export async function getCards (path: string) {

    const cards = await readPtCardList(path, ptCardList)
    return cards;

}

export async function writeCards (path: string, cards: CsvRecord[]) {

    const db = new Database(path);
    const script = ptCardListLoadScript(cards, ptCardList);

    await db.execute(script);

}

export function readPtCardList (file, columns: CsvDataColumn[]) : Promise<CsvRecord[]> {

    return new Promise ((resolve,reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {

            if (!err) {
                let lines = data.split('\r\n');
                
                let sourceHeaders: string[] = removeTrailingComma(lines[0]).replace('//','').split(',');

                if (sourceHeaders.length === columns.length) {

                    for (let headerIndex = 0; headerIndex < sourceHeaders.length; headerIndex++) {
                        if (sourceHeaders[headerIndex] !== columns[headerIndex].nameInSource) {
                            reject({reason:`${sourceHeaders[headerIndex]} is not the expected column name in place ${headerIndex}`})
                        }
                    }

                    const parsedData: CsvRecord[] = [];

                    const parseCardDataValue = (curColumn: CsvDataColumn, value: string) => {
                        switch (curColumn.type) {
                            case "INTEGER":
                                return parseInt(value ? value : "0");
                            case "DECIMAL":
                                return parseFloat(value? value : "0");
                            case "DATETIME":
                                return value;
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

export const getLiveUpdates = async (db: Database) => {
    return await db.getAllMapped<LiveUpdate>(getLiveUpdatesScript());
}