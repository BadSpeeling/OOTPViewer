import * as fs from 'fs';
import { PtCard } from './PtCard';
import { PtConnection } from './database/PtConnection';

import {Request,TYPES} from 'tedious'

const uttCards = require('./database/uttColumns').uttCards

function readFile (file) : Promise<{parsedData: PtCard[], headers: string[]}> {
    return new Promise ((resolve,reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {

            if (!err) {
                let lines = data.split('\r\n');

                let headers: string[] = removeTrailingComma(lines[0]).replace('//','').replaceAll(' ','').split(',');
                headers = headers.map((value) => value.trim());
                
                let parsedData = [];

                for (let index = 1; index < lines.length; index++) {

                    //make sure the line isn't empty
                    if (lines[index] !== '') {

                        let curCardLine = removeTrailingComma(lines[index]).split(',');
                        let curPtCard = new PtCard("CSV",headers,curCardLine)

                        parsedData.push(curPtCard);
                    }

                }
                
                resolve({headers,parsedData});

            }

        })
    })
}

const removeTrailingComma = (line) => {
    return line.substring(0,line.length-1)
}

async function readPlayerList() {

    let file = 'C:\\Users\\ericf\\OneDrive\\Documents\\Out of the Park Developments\\OOTP Baseball 25\\online_data\\pt_card_list.csv';

    let csvResult = await readFile(file);
    let ptConnection = new PtConnection();
    let connection = await ptConnection.connect();

    let uttRows = [];

    let cards = csvResult.parsedData;
    let headers = csvResult.headers;

    let uttColumns = uttCards
    let uttCardIDIndex = uttColumns.indexOf({name:'CardID', type: TYPES.Int});

    if (uttCardIDIndex !== -1) {

        for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
            
            let uttRow = [];

            for (let headerIndex = 0; headerIndex < uttColumns.length; headerIndex++) {
                let uttValue = cards[cardIndex].cardRatings[uttColumns[headerIndex].name]
                uttRow.push(uttValue !== undefined ? uttValue : null);
            }

            if (!uttRows.find((val) => val[0] === uttRow[0])) {
                uttRows.push(uttRow);
            }

        }

    }
    else {
        throw Error("Could not find uttCard CardID value");
    }

    let table = {
        columns: uttColumns,
        rows: uttRows
      };
    
    var request = new Request("spInsertCards", function(err) {
        if (!err) {
            console.log('spInsertCards execute without error');
        }
        else {
            console.log(err);
        }
    });

    //console.log(uttRows);
    request.addParameter('playerCards', TYPES.TVP, table);
    
    let result = connection.callProcedure(request);
    
}

readPlayerList()