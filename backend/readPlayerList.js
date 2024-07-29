const fs = require('fs');
const PtCard = require('./PtCard').PtCard
const PtConnection = require('./PtConnection').PtConnection;

const Request = require('tedious').Request;  
const TYPES = require('tedious').TYPES;  

const uttCards = require('./uttColumns').uttCards

function readFile (file) {
    return new Promise ((resolve,reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {

            if (!err) {
                lines = data.split('\r\n');

                headers = removeTrailingComma(lines[0]).replace('//','').replaceAll(' ','').split(',');
                        
                headers = headers.map((value) => value.trim());
                
                parsedData = [];

                for (let index = 1; index < lines.length; index++) {

                    //make sure the line isn't empty
                    if (lines[index] !== '') {

                        curCardLine = removeTrailingComma(lines[index]).split(',');
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

    for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
        
        let uttRow = [];

        for (let headerIndex = 0; headerIndex < uttColumns.length; headerIndex++) {
            let uttValue = cards[cardIndex].cardRatings[uttColumns[headerIndex].name]
            uttRow.push(uttValue !== undefined ? uttValue : null);
        }

        uttRows.push(uttRow);

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