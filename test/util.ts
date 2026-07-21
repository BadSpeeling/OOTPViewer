import { IDatatableCreator, IJsonModelReader, LocalSqliteDatatableCreator } from "../src/backend/database-creator";
import { Database } from "../src/backend/database/Database";
import { DatatableModel } from "../src/backend/types";
import * as path from 'node:path';
import * as fs from 'node:fs';

export const checkErrorMessage = (err: unknown, desiredErrMessage: string) => {
    
    if (err instanceof Error) {
        return err.message.includes(desiredErrMessage)
    }

    return false;

}

export const initializeDatabase = async (databaseFilePath: string[], reader: IJsonModelReader<DatatableModel>) => {

    const databaseFile = createDatabase(databaseFilePath);
    const db = new Database(databaseFile)
    const creator: IDatatableCreator = new LocalSqliteDatatableCreator(reader, db);  
    await creator.createDataTables();

    return db;

}

const createDatabase = (databasePath: string[],) => {
    const currTime = Date.now();    
    const databaseFilePath = [...databasePath, `${currTime}.db`];
    fs.closeSync(fs.openSync(path.join(...databaseFilePath), 'w'));
    return databaseFilePath;
}