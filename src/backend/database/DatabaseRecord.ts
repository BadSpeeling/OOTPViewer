import { Request, TYPES } from 'tedious';  
import { PtConnection } from './PtConnection';

export class DatabaseRecord {

    [key:string]: string

    constructor(record) {
        
        for (let cardValueIndex = 0; cardValueIndex < record.length; cardValueIndex++) {
            
            let curCol = record[cardValueIndex];
            this[curCol.metadata.colName] = curCol.value;    

        }
    }

}

export async function queryDatabase (sqlQuery): Promise<DatabaseRecord[]> {

    let ptConnection = new PtConnection();
    let connection = await ptConnection.connect();

    return new Promise ((resolve,reject) => {

        let request = new Request(sqlQuery, function(err) {  
            if (err) {  
                reject(err);
            }  
        });  

        let records: DatabaseRecord[] = []
        
        request.on('row', function(columns) {  
            records.push(new DatabaseRecord(columns));
        });  

        request.on('done', function(rowCount, more) {  
            console.log(rowCount + ' rows returned');  
        });  

        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", () => {
            resolve(records);
            connection.close();
        })

        connection.execSql(request);  
   
    });
}