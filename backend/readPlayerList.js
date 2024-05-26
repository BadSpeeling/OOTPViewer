const fs = require('fs');
const PtCard = require('./PtCard').PtCard
const PtConnection = require('./PtConnection').PtConnection;

const Request = require('tedious').Request;  
const TYPES = require('tedious').TYPES;  

function readFile (file) {
    return new Promise ((resolve,reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {

            if (!err) {
                lines = data.split('\r\n');

                headers = removeTrailingComma(lines[0]).split(',');
                        
                headers = headers.map((value) => value.trim());
                headers[0] = headers[0].replace('//','')

                parsedData = [];

                for (let index = 1; index < lines.length; index++) {

                    //make sure the line isn't empty
                    if (lines[index] !== '') {

                        curCardLine = removeTrailingComma(lines[index]).split(',');
                        let curPtCard = new PtCard("CSV",headers,curCardLine)

                        parsedData.push(curPtCard);
                    }

                }
                
                resolve(parsedData);

            }

        })
    })
}

const removeTrailingComma = (line) => {
    return line.substring(0,line.length-1)
}

async function readPlayerList() {

    let file = 'C:\\Users\\ericf\\OneDrive\\Documents\\Out of the Park Developments\\OOTP Baseball 25\\online_data\\pt_card_list.csv';

    //let ptCards = await readFile(file);
    let ptConnection = new PtConnection();
    let connection = await ptConnection.connect();

    var table = {
        columns: [
          {name: 'CardID', type: TYPES.Int},
          {name: 'CardTitle', type: TYPES.VarChar, length: 200},
        ],
        rows: [
          [1, 'Eric'],
          [2, 'John']
        ]
      };
    
      var request = new Request("spInsertCards", function(err) {
        if (!err) {
            console.log('spInsertCards execute without error');
        }
        else {
            console.log(err);
        }
      });
    
      request.addParameter('playerCards', TYPES.TVP, table);
    
    let result = connection.callProcedure(request);
    
}

readPlayerList()