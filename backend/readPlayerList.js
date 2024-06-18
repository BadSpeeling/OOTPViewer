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

                headers = lines[0].replace('//','').replaceAll(' ','').split(',');
                        
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

    let uttColumns = [
        {name:'CardTitle', type: TYPES.VarChar, length: 200},
        {name:'CardID', type: TYPES.Int},
        {name:'CardValue', type: TYPES.Int},
        {name:'CardType', type: TYPES.Int},
        {name:'CardSubType', type: TYPES.Int},
        {name:'Year', type: TYPES.Int},
        {name:'Peak', type: TYPES.VarChar, length:1},
        {name:'Team', type: TYPES.VarChar, length: 100},
        {name:'LastName', type: TYPES.VarChar, length: 100},
        {name:'FirstName', type: TYPES.VarChar, length: 100},
        {name:'NickName', type: TYPES.VarChar, length: 100},
        {name:'UniformNumber', type: TYPES.Int},
        {name:'DayOB', type: TYPES.Int},
        {name:'MonthOB', type: TYPES.Int},
        {name:'YearOB', type: TYPES.Int},
        {name:'Bats', type: TYPES.Int},
        {name:'Throws', type: TYPES.Int},
        {name:'Position', type: TYPES.Int},
        {name:'PitcherRole', type: TYPES.Int},
        {name:'Contact', type: TYPES.Int},
        {name:'Gap', type: TYPES.Int},
        {name:'Power', type: TYPES.Int},
        {name:'Eye', type: TYPES.Int},
        {name:'AvoidKs', type: TYPES.Int},
        {name:'BABIP', type: TYPES.Int},
        {name:'ContactvL', type: TYPES.Int},
        {name:'GapvL', type: TYPES.Int},
        {name:'PowervL', type: TYPES.Int},
        {name:'EyevL', type: TYPES.Int},
        {name:'AvoidKvL', type: TYPES.Int},
        {name:'BABIPvL', type: TYPES.Int},
        {name:'ContactvR', type: TYPES.Int},
        {name:'GapvR', type: TYPES.Int},
        {name:'PowervR', type: TYPES.Int},
        {name:'EyevR', type: TYPES.Int},
        {name:'AvoidKvR', type: TYPES.Int},
        {name:'BABIPvR', type: TYPES.Int},
        {name:'GBHitterType', type: TYPES.Int},
        {name:'FBHitterType', type: TYPES.Int},
        {name:'BattedBallType', type: TYPES.Int},
        {name:'Speed', type: TYPES.Int},
        {name:'StealRate', type: TYPES.Int},
        {name:'Stealing', type: TYPES.Int},
        {name:'Baserunning', type: TYPES.Int},
        {name:'Sacbunt', type: TYPES.Int},
        {name:'Buntforhit', type: TYPES.Int},
        {name:'Stuff', type: TYPES.Int},
        {name:'Movement', type: TYPES.Int},
        {name:'Control', type: TYPES.Int},
        {name:'pHR', type: TYPES.Int},
        {name:'pBABIP', type: TYPES.Int},
        {name:'StuffvL', type: TYPES.Int},
        {name:'MovementvL', type: TYPES.Int},
        {name:'ControlvL', type: TYPES.Int},
        {name:'pHRvL', type: TYPES.Int},
        {name:'pBABIPvL', type: TYPES.Int},
        {name:'StuffvR', type: TYPES.Int},
        {name:'MovementvR', type: TYPES.Int},
        {name:'ControlvR', type: TYPES.Int},
        {name:'pHRvR', type: TYPES.Int},
        {name:'pBABIPvR', type: TYPES.Int},
        {name:'Fastball', type: TYPES.Int},
        {name:'Slider', type: TYPES.Int},
        {name:'Curveball', type: TYPES.Int},
        {name:'Changeup', type: TYPES.Int},
        {name:'Cutter', type: TYPES.Int},
        {name:'Sinker', type: TYPES.Int},
        {name:'Splitter', type: TYPES.Int},
        {name:'Forkball', type: TYPES.Int},
        {name:'Screwball', type: TYPES.Int},
        {name:'Circlechange', type: TYPES.Int},
        {name:'Knucklecurve', type: TYPES.Int},
        {name:'Knuckleball', type: TYPES.Int},
        {name:'Stamina', type: TYPES.Int},
        {name:'Hold', type: TYPES.Int},
        {name:'GB', type: TYPES.Int},
        {name:'Velocity', type: TYPES.VarChar, length: 10},
        {name:'ArmSlot', type: TYPES.Int},
        {name:'Height', type: TYPES.Int},
        {name:'InfieldRange', type: TYPES.Int},
        {name:'InfieldError', type: TYPES.Int},
        {name:'InfieldArm', type: TYPES.Int},
        {name:'DP', type: TYPES.Int},
        {name:'CatcherAbil', type: TYPES.Int},
        {name:'CatcherFrame', type: TYPES.Int},
        {name:'CatcherArm', type: TYPES.Int},
        {name:'OFRange', type: TYPES.Int},
        {name:'OFError', type: TYPES.Int},
        {name:'OFArm', type: TYPES.Int},
        {name:'PosRatingP', type: TYPES.Int},
        {name:'PosRatingC', type: TYPES.Int},
        {name:'PosRating1B', type: TYPES.Int},
        {name:'PosRating2B', type: TYPES.Int},
        {name:'PosRating3B', type: TYPES.Int},
        {name:'PosRatingSS', type: TYPES.Int},
        {name:'PosRatingLF', type: TYPES.Int},
        {name:'PosRatingCF', type: TYPES.Int},
        {name:'PosRatingRF', type: TYPES.Int},
        {name:'LearnC', type: TYPES.Bit},
        {name:'Learn1B', type: TYPES.Bit},
        {name:'Learn2B', type: TYPES.Bit},
        {name:'Learn3B', type: TYPES.Bit},
        {name:'LearnSS', type: TYPES.Bit},
        {name:'LearnLF', type: TYPES.Bit},
        {name:'LearnCF', type: TYPES.Int},
        {name:'LearnRF', type: TYPES.Int},
        {name:'era', type: TYPES.Int},
        {name:'tier', type: TYPES.Int},
        {name:'MissionValue', type: TYPES.Int},
        {name:'date', type: TYPES.Date}
    ]

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