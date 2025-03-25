import * as sqlite3 from 'sqlite3'
import * as sqlite from 'sqlite'
import * as path from 'node:path'

import * as tableColumns from "../../../json/tableColumns.json";
import { Datatable } from "./Datatable";
import { DatabaseRecord } from '../types'

import * as settings from "../../../settings.json"

export class Database {

    databasePath: string;

    constructor (databasePath: string) {
        this.databasePath = databasePath;
    }

    async #getConnection () {
        return await sqlite.open({
            filename: this.databasePath,
            driver: sqlite3.Database
        });
    }

    sanitize (sql: string) {
        return sql.replaceAll('--','');
    }

    async createTables () {

        const isTemporaryFlag = false;

        const tableNames = [{tableName:"PtCard",primaryKey:"PtCardID"},{tableName:"LiveUpdate",primaryKey:"LiveUpdateID"},{tableName:"CardMarketValue",primaryKey:"CardMarketValueID"}];
        const tables = tableNames.map((table) => new Datatable(table.tableName,isTemporaryFlag,tableColumns[table.tableName]));

        await this.execute(tables.map((table) => table.createTableString()).join(""));
        
    }

    async execute (sql: string) {
    
        const db = await this.#getConnection();

        await db.exec(this.sanitize(sql));
        await db.close();
        
    }

    async insertOne (sql: string): Promise<number> {

        const db = await this.#getConnection();

        const result = await db.run(this.sanitize(sql));
        await db.close();

        return result.lastID;

    }

    async get (sql: string): Promise<DatabaseRecord> {

        const db = await this.#getConnection();

        const result = await db.get(this.sanitize(sql));
        await db.close();

        return result;

    }

    async getMapped <T> (sql: string): Promise<T> {

        const db = await this.#getConnection();

        const result = await db.get(this.sanitize(sql))
        await db.close();

        return result as T;

    }

    async getAll (sql: string): Promise<DatabaseRecord[]> {

        const db = await this.#getConnection();

        const result = await db.all(this.sanitize(sql))
        await db.close();

        return result;

    }

    async getAllMapped <T> (sql: string): Promise<T[]> {

        const db = await this.#getConnection();

        const result = await db.all(this.sanitize(sql))
        await db.close();

        return result.map((row) => row as T)

    }

}

export const getDatabase = () => {
    return new Database(path.join(...settings.databasePath));
}
