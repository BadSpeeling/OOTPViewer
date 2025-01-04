import { Connection, ConnectionConfiguration } from 'tedious';  

export class PtConnection {

    connection: Connection;

    constructor () {

        var config : ConnectionConfiguration = {  
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

        this.connection = new Connection(config); 

    }

    connect () : Promise<Connection> {

        return new Promise((resolve,reject) => {
            
            let connection = this.connection;

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

}