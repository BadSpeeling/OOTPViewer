let Connection = require('tedious').Connection;  
let Request = require('tedious').Request;  
let TYPES = require('tedious').TYPES;  

class DatabaseRecord {

    constructor(record) {
        
        for (let cardValueIndex = 0; cardValueIndex < record.length; cardValueIndex++) {
            
            let curCol = record[cardValueIndex];
            this[curCol.metadata.colName] = curCol.value;    

        }
    }

}

function connect () {

    return new Promise((resolve,reject) => {

        var config = {  
            server: 'localhost',
            //port: '51397',
            authentication: {
                type: 'default',
                options: {
                    userName: 'ootp_pt',
                    //userName: 'DESKTOP-LREGU2K\\efrye',
                    password: 'securepassword',
                }
            },
            options: {
                trustServerCertificate: true,
                database: "ootp_data"
            }
        };  
        var connection = new Connection(config);  
        connection.on('connect', function(err) {
            if (err) {
                console.log("There was an issue connecting")
                reject(err);
            }
            else {
                resolve(connection);
            }
        });
        
        connection.connect();

    });

}

async function queryDatabase (sqlQuery) {

    let connection = await connect()

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