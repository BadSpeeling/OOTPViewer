const fs = require('fs');
const PtCard = require('./PtCard').PtCard

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

    let file = 'C:\\Users\\ericf\\OneDrive\\Documents\\Out of the Park Developments\\OOTP Baseball 24\\online_data\\pt_card_list.csv';

    let ptCards = await readFile(file)
    console.log(ptCards)

}

readPlayerList()