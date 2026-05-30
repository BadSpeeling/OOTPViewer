import { Database } from '../database/Database'

export interface IDatabaseCreator {

    createDatabase: () => Database

}