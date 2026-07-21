import * as sqlite3 from 'sqlite3'
import * as sqlite from 'sqlite'

import * as path from 'node:path'

import { DatabaseRecord } from '../types'


export class Database {

    databasePath: string[];

    constructor (databasePath: string[]) {
        this.databasePath = databasePath;
    }

    async #getConnection () {
        return await sqlite.open({
            filename: path.join(...this.databasePath),
            driver: sqlite3.Database
        });
    }

    sanitize (sql: string) {
        return sql.replaceAll('--','');
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