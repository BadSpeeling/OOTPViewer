var Connection = require('tedious').Connection;  

class Card {

    constructor(card) {
        
        for (let card_value_index = 0; card_value_index < card.length; card_value_index++) {
            
            let cur_col = card[card_value_index];
            this[cur_col.metadata.colName] = cur_col.value;    

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
                trustServerCertificate: true
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

async function initPageData () {

    let connection = await connect()

    return new Promise ((resolve,reject) => {
        
        let Request = require('tedious').Request;  
        let TYPES = require('tedious').TYPES;  

        let request = new Request("SELECT TOP 5 * FROM ootp_data.dbo.pt_card_list_20240404", function(err) {  
            if (err) {  
                reject(err);
            }  
        });  

        let cards = []
        
        request.on('row', function(columns) {  
            cards.push(new Card(columns));
        });  

        request.on('done', function(rowCount, more) {  
            console.log(rowCount + ' rows returned');  
        });  

        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", (rowCount,more) => {
            resolve(cards);
            connection.close();
        })

        connection.execSql(request);  
   
    });
}

//module.exports.Card = Card;
module.exports.initPageData = initPageData;