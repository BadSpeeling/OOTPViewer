import { Database } from "../database/Database";
import { IDatabaseCreator } from "./IDatabaseCreator";

import * as fs from 'node:fs'
import * as path from 'node:path'

export class LocalSqliteDatabaseCreator implements IDatabaseCreator {

    DatabaseFilePath: string[]

    constructor (databaseFilePath: string[]) {
        this.DatabaseFilePath = databaseFilePath;
    }

    createDatabase() {

        if (this.DatabaseFilePath.length > 0 && !this.DatabaseFilePath[this.DatabaseFilePath.length-1].includes('.db')) {
            throw new Error(path.join(...this.DatabaseFilePath) + " is not a SQLite db file")
        }

        if (!fs.existsSync(path.join(...this.DatabaseFilePath.slice(0, -1)))) {
            throw new Error(path.join(...this.DatabaseFilePath.slice(0, -1)) + " is not a folder that exists")
        }

        if (fs.existsSync(path.join(...this.DatabaseFilePath))) {
            throw new Error(path.join(...this.DatabaseFilePath) + " is already an existing SQLite db file")
        }

        this.createDatabaseFile();
        return new Database(this.DatabaseFilePath)
        
    }

    private createDatabaseFile () {
        fs.closeSync(fs.openSync(path.join(...this.DatabaseFilePath), 'w'));
    }

    

}