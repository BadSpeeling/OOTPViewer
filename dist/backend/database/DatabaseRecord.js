const Request = require('tedious').Request;  
const TYPES = require('tedious').TYPES;  
const PtConnection = require('./PtConnection.js').PtConnection;

class DatabaseRecord {

    constructor(record) {
        
        for (let cardValueIndex = 0; cardValueIndex < record.length; cardValueIndex++) {
            
            let curCol = record[cardValueIndex];
            this[curCol.metadata.colName] = curCol.value;    

        }
    }

}

async function queryDatabase (sqlQuery) {

    let ptConnection = new PtConnection();
    let connection = await ptConnection.connect();

    return new Promise ((resolve,reject) => {

        let request = new Request(sqlQuery, function(err) {  
            if (err) {  
                reject(err);
            }  
        });  

        let records = []
        
        request.on('row', function(columns) {  
            records.push(new DatabaseRecord(columns));
        });  

        request.on('done', function(rowCount, more) {  
            console.log(rowCount + ' rows returned');  
        });  

        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", (rowCount,more) => {
            resolve(records);
            connection.close();
        })

        connection.execSql(request);  
   
    });
}

module.exports.queryDatabase = queryDatabase;