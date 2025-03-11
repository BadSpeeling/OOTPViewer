import * as fs from 'fs';
import * as path from 'node:path'

import { Database } from "./database/Database"
import { ptCardListLoadScript } from './database/sqliteScripts'

import { ptCardList } from '../../json/csvColumns.json'
import { CsvDataColumn,CsvRecord } from "./types"

import * as settings from "../../settings.json"

//     const script = await ptCardListLoadScript([liveCard,historicalCard],ptCardList);
//     const database = new Database(".\\test\\test.db");

//     await database.execute(script);
//     const liveCardRecord = await database.get(`select CardID,CardTitle,CardValue from Card where CardID = 64889`)
//     const historicalCardRecord = await database.get(`select CardID,CardTitle,CardValue from Card where CardID = 65911`)
    

export async function processPtCardList () {

    const ptCardListPath = path.join(...settings.ootpRoot, ...settings.ptCardFile);
    const cards = await readPtCardList(ptCardListPath, ptCardList)

    const db = new Database(path.join(...settings.databasePath));
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
                                return parseInt(value);
                            case "DECIMAL":
                                return parseFloat(value);
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

// async function readPlayerList() {

//     let file = 'C:\\Users\\ericf\\OneDrive\\Documents\\Out of the Park Developments\\OOTP Baseball 25\\online_data\\pt_card_list.csv';

//     let csvResult = await readFile(file);
//     let ptConnection = new PtConnection();
//     let connection = await ptConnection.connect();

//     let uttRows = [];

//     let cards = csvResult.parsedData;
//     let headers = csvResult.headers;

//     let uttColumns = uttCards
//     let uttCardIDIndex = uttColumns.indexOf({name:'CardID', type: TYPES.Int});

//     if (uttCardIDIndex !== -1) {

//         for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
            
//             let uttRow = [];

//             for (let headerIndex = 0; headerIndex < uttColumns.length; headerIndex++) {
//                 let uttValue = cards[cardIndex].cardRatings[uttColumns[headerIndex].name]
//                 uttRow.push(uttValue !== undefined ? uttValue : null);
//             }

//             if (!uttRows.find((val) => val[0] === uttRow[0])) {
//                 uttRows.push(uttRow);
//             }

//         }

//     }
//     else {
//         throw Error("Could not find uttCard CardID value");
//     }

//     let table = {
//         columns: uttColumns,
//         rows: uttRows
//       };
    
//     var request = new Request("spInsertCards", function(err) {
//         if (!err) {
//             console.log('spInsertCards execute without error');
//         }
//         else {
//             console.log(err);
//         }
//     });

//     //console.log(uttRows);
//     request.addParameter('playerCards', TYPES.TVP, table);
    
//     let result = connection.callProcedure(request);
    
// }

// readPlayerList()